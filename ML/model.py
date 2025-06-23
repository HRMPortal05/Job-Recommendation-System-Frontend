from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re
import logging
import PyPDF2
import io
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Download necessary NLTK data with error handling
try:
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)
    nltk.download('punkt', quiet=True)
except Exception as e:
    logger.warning(f"Could not download NLTK data: {e}")

class JobRecommendationTransformer:
    def __init__(self):
        try:
            self.lemmatizer = WordNetLemmatizer()
            self.stop_words = set(stopwords.words('english'))
        except Exception as e:
            logger.warning(f"Could not initialize NLTK components: {e}")
            self.lemmatizer = None
            self.stop_words = set()
        
        self.vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=5000,
            ngram_range=(1, 2),
            min_df=1,
            max_df=0.95
        )
    
    def preprocess_text(self, text):
        """Preprocess text by lowercasing, removing special chars, lemmatizing"""
        if not text or not isinstance(text, str):
            return ""
            
        try:
            text = re.sub(r'[^\w\s]', ' ', text.lower())
            if self.lemmatizer and self.stop_words:
                tokens = [
                    self.lemmatizer.lemmatize(word) 
                    for word in text.split() 
                    if word not in self.stop_words and len(word) > 2
                ]
            else:
                tokens = [word for word in text.split() if len(word) > 2]
            return " ".join(tokens)
        except Exception as e:
            logger.error(f"Error in text preprocessing: {e}")
            return text.lower()
    
    def extract_resume_data(self, resume_url):
        """Extract relevant information from the resume PDF"""
        try:
            if not resume_url or not isinstance(resume_url, str):
                return {}
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(resume_url, headers=headers, timeout=30)
            if response.status_code != 200:
                logger.warning(f"Failed to download resume: {response.status_code}")
                return {}
                
            pdf_file = io.BytesIO(response.content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = ""
            for page in pdf_reader.pages:
                try:
                    text += page.extract_text() + "\n"
                except Exception as e:
                    logger.warning(f"Error extracting text from page: {e}")
                    continue
            
            if not text.strip():
                logger.warning("No text extracted from resume PDF")
                return {}
            
            extracted_data = {
                "full_text": text,
                "extracted_skills": self.extract_skills(text),
                "extracted_education": self.extract_education(text),
                "extracted_experience": self.extract_experience(text),
            }
            return extracted_data
            
        except requests.RequestException as e:
            logger.error(f"Network error extracting resume data: {e}")
            return {}
        except Exception as e:
            logger.error(f"Error extracting resume data: {e}")
            return {}
    
    def extract_skills(self, text):
        """Extract skills from resume text"""
        common_skills = [
            "python", "java", "javascript", "typescript", "c++", "c#", "php", "ruby", 
            "go", "rust", "swift", "kotlin", "scala", "r", "matlab", "perl",
            "react", "angular", "vue", "nodejs", "express", "django", "flask", 
            "fastapi", "spring", "spring boot", "laravel", "rails", "asp.net",
            "html", "css", "sass", "less", "bootstrap", "tailwind",
            "sql", "nosql", "mongodb", "postgresql", "mysql", "oracle", "redis",
            "elasticsearch", "cassandra", "dynamodb", "firebase",
            "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins",
            "ci/cd", "git", "github", "gitlab", "devops", "ansible", "chef", "puppet",
            "power bi", "tableau", "excel", "pandas", "numpy", "scipy", "matplotlib",
            "seaborn", "plotly", "jupyter", "spark", "hadoop", "kafka", "airflow",
            "ai", "ml", "machine learning", "deep learning", "tensorflow", "pytorch", 
            "keras", "scikit-learn", "nlp", "computer vision", "opencv", "transformers",
            "android", "ios", "react native", "flutter", "xamarin", "ionic",
            "selenium", "cypress", "jest", "junit", "pytest", "testing", "automation testing",
            "agile", "scrum", "kanban", "waterfall", "tdd", "bdd",
            "rest api", "graphql", "microservices", "blockchain", "iot", "unity",
            "figma", "sketch", "photoshop", "ui/ux", "responsive design"
        ]
        
        found_skills = []
        text_lower = text.lower()
        for skill in common_skills:
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append(skill)
        return ", ".join(found_skills)
    
    def extract_education(self, text):
        """Extract education details from resume text"""
        education_keywords = [
            "bachelor", "b.tech", "b.e", "b.sc", "b.com", "b.a", "bs", "be",
            "master", "m.tech", "m.e", "m.sc", "m.com", "m.a", "ms", "me", "mba",
            "phd", "ph.d", "doctorate", "diploma", "certification", "degree",
            "university", "college", "institute", "school"
        ]
        
        education_info = ""
        text_lower = text.lower()
        for line in text_lower.split('\n'):
            line_clean = line.strip()
            if line_clean and any(keyword in line_clean for keyword in education_keywords):
                education_info += line_clean + " "
        return education_info.strip()
    
    def extract_experience(self, text):
        """Extract experience details from resume text"""
        experience_keywords = [
            "experience", "work history", "employment", "job history", 
            "professional experience", "work experience", "internship",
            "career", "position", "role", "responsibilities"
        ]
        
        experience_info = ""
        found_experience_section = False
        lines = text.split('\n')
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            if not line_lower:
                continue
            if any(keyword in line_lower for keyword in experience_keywords):
                found_experience_section = True
                experience_info += line.strip() + " "
                for j in range(1, min(8, len(lines) - i)):
                    next_line = lines[i + j].strip()
                    if next_line:
                        experience_info += next_line + " "
        return experience_info.strip()
    
    def extract_user_tags(self, user_data):
        """Extract relevant tags from user data for job search, only from keySkills"""
        try:
            tags = set()
            key_skills = user_data.get('keySkills', '')
            if key_skills and isinstance(key_skills, str) and key_skills.strip():
                skills = [skill.strip().lower() for skill in key_skills.split(',') if skill.strip()]
                # Normalize skill names for broader matching
                skill_mappings = {
                    'springboot': ['spring boot', 'springboot'],
                    'spring security': ['spring security'],
                    'postgresql': ['postgres', 'postgresql'],
                    'java': ['java', 'j2ee']
                }
                for skill in skills:
                    tags.add(skill)
                    if skill in skill_mappings:
                        tags.update(skill_mappings[skill])
                logger.info(f"Extracted and normalized skills from keySkills: {list(tags)}")
            
            job_type = user_data.get('preferedJobType', '')
            if job_type and isinstance(job_type, str) and job_type.strip():
                tags.add(job_type.strip().lower())
            
            location = user_data.get('preferedLocation', '')
            if location and isinstance(location, str) and location.strip():
                locations = [loc.strip().lower() for loc in location.split(',') if loc.strip()]
                # Normalize location names
                location_mappings = {
                    'bangalore/bengaluru': ['bangalore', 'bengaluru'],
                    'rajkot': ['rajkot'],
                    'pune': ['pune'],
                    'ahmedabad': ['ahmedabad']
                }
                for loc in locations:
                    tags.add(loc)
                    if loc in location_mappings:
                        tags.update(location_mappings[loc])
            
            if not tags:
                tags.add('general')
                logger.info("Added default tag 'general' due to no specific tags found")
            
            return list(tags) if tags else ['general']
            
        except Exception as e:
            logger.error(f"Error extracting user tags: {e}")
            return ['general']
    
    def prepare_user_profile(self, user_data, resume_data=None):
        """Combine user data with resume data to create a comprehensive profile"""
        try:
            users_info = user_data.get('users', {})
            profile = {
                "name": f"{users_info.get('firstName', '')} {users_info.get('lastName', '')}".strip(),
                "email": users_info.get('email', ''),
                "phone": users_info.get('phone', ''),
                "profile_summary": user_data.get('profileSummary', ''),
                "key_skills": user_data.get('keySkills', ''),
                "preferred_job_type": user_data.get('preferedJobType', ''),
                "preferred_location": user_data.get('preferedLocation', ''),
                "availability": user_data.get('availabilityToWork', ''),
                "languages": user_data.get('language', ''),
                "education": []
            }
            
            education_data = user_data.get('education', {})
            if isinstance(education_data, dict) and 'degrees' in education_data:
                for degree in education_data['degrees']:
                    if isinstance(degree, dict):
                        profile['education'].append({
                            'degree': degree.get('degreeName', ''),
                            'course': degree.get('courseName', ''),
                            'university': degree.get('universityName', ''),
                            'duration': f"{degree.get('courseDurationFrom', '')} to {degree.get('courseDurationTo', '')}",
                            'cgpa': degree.get('cgpa', '')
                        })
            
            profile['internships'] = []
            internships = user_data.get('internships', [])
            if isinstance(internships, list):
                for internship in internships:
                    if isinstance(internship, dict):
                        profile['internships'].append({
                            'company': internship.get('companyName', ''),
                            'duration': f"{internship.get('durationFrom', '')} to {internship.get('durationTo', '')}",
                            'description': internship.get('description', '')
                        })
            
            profile['projects'] = []
            projects = user_data.get('projects', [])
            if isinstance(projects, list):
                for project in projects:
                    if isinstance(project, dict):
                        profile['projects'].append({
                            'name': project.get('projectName', ''),
                            'duration': f"{project.get('projectDurationFrom', '')} to {project.get('projectDurationTo', '')}",
                            'description': project.get('projectDescription', '')
                        })
            
            if resume_data and isinstance(resume_data, dict):
                if resume_data.get('extracted_skills'):
                    existing_skills = set()
                    if profile['key_skills']:
                        existing_skills = set(skill.strip().lower() for skill in profile['key_skills'].split(','))
                    resume_skills = set()
                    if resume_data.get('extracted_skills'):
                        resume_skills = set(skill.strip().lower() for skill in resume_data['extracted_skills'].split(','))
                    combined_skills = existing_skills.union(resume_skills)
                    profile['key_skills'] = ', '.join([skill for skill in combined_skills if skill])
                profile['resume_text'] = resume_data.get('full_text', '')
            
            return profile
            
        except Exception as e:
            logger.error(f"Error preparing user profile: {e}")
            return {
                "name": "",
                "email": "",
                "profile_summary": user_data.get('profileSummary', ''),
                "key_skills": user_data.get('keySkills', ''),
                "preferred_job_type": user_data.get('preferedJobType', ''),
                "preferred_location": user_data.get('preferedLocation', ''),
                "education": [],
                "internships": [],
                "projects": []
            }
    
    def create_job_vectors(self, jobs):
        """Create feature vectors for jobs"""
        try:
            job_texts = []
            for job in jobs:
                if not isinstance(job, dict):
                    job_texts.append("")
                    continue
                job_text_parts = [
                    job.get('title', ''),
                    job.get('company_name', ''),
                    job.get('category', ''),
                    ' '.join(job.get('tags', []) if isinstance(job.get('tags', []), list) else []),
                    job.get('description', ''),
                    job.get('candidate_required_location', ''),
                    job.get('job_type', '')
                ]
                job_text = ' '.join(str(part) for part in job_text_parts if part)
                job_texts.append(self.preprocess_text(job_text))
            
            if job_texts and any(t.strip() for t in job_texts):
                job_vectors = self.vectorizer.fit_transform(job_texts)
            else:
                job_vectors = []
            
            return job_vectors, job_texts
            
        except Exception as e:
            logger.error(f"Error creating job vectors: {e}")
            return [], [""]
    
    def create_user_vector(self, user_profile, job_texts):
        """Create feature vector for user"""
        try:
            if not isinstance(user_profile, dict):
                user_profile = {}
            
            user_text_parts = [
                user_profile.get('profile_summary', ''),
                user_profile.get('key_skills', ''),
                user_profile.get('preferred_job_type', ''),
                user_profile.get('preferred_location', '')
            ]
            
            for edu in user_profile.get('education', []):
                if isinstance(edu, dict):
                    user_text_parts.extend([
                        edu.get('degree', ''),
                        edu.get('course', ''),
                        edu.get('university', '')
                    ])
            
            for internship in user_profile.get('internships', []):
                if isinstance(internship, dict):
                    user_text_parts.extend([
                        internship.get('company', ''),
                        internship.get('description', '')
                    ])
            
            for project in user_profile.get('projects', []):
                if isinstance(project, dict):
                    user_text_parts.extend([
                        project.get('name', ''),
                        project.get('description', '')
                    ])
            
            if 'resume_text' in user_profile:
                user_text_parts.append(user_profile['resume_text'])
            
            user_text = ' '.join(str(part) for part in user_text_parts if part)
            processed_user_text = self.preprocess_text(user_text)
            user_vector = self.vectorizer.transform([processed_user_text])
            return user_vector
            
        except Exception as e:
            logger.error(f"Error creating user vector: {e}")
            return self.vectorizer.transform([""])
    
    def calculate_match_scores(self, user_vector, job_vectors, jobs):
        """Calculate match scores between user and jobs"""
        try:
            if not job_vectors or job_vectors.shape[0] == 0:
                return [(job, 0.0) for job in jobs]
            similarity_scores = cosine_similarity(user_vector, job_vectors).flatten()
            job_scores = []
            for i in range(min(len(jobs), len(similarity_scores))):
                job_scores.append((jobs[i], similarity_scores[i]))
            job_scores.sort(key=lambda x: x[1], reverse=True)
            return job_scores
            
        except Exception as e:
            logger.error(f"Error calculating match scores: {e}")
            return [(job, 0.0) for job in jobs]
    
    def check_location_match(self, user_locations, job_location):
        """Check if user's preferred location matches job location"""
        try:
            if not user_locations or not job_location:
                return False
            
            user_locations_lower = user_locations.lower()
            job_location_lower = job_location.lower()
            if user_locations_lower == job_location_lower:
                return True
            
            user_parts = [part.strip() for part in user_locations_lower.split(',')]
            for part in user_parts:
                if part and part in job_location_lower:
                    return True
            if job_location_lower in user_locations_lower:
                return True
            return False
            
        except Exception as e:
            logger.error(f"Error checking location match: {e}")
            return False
    
    def check_job_type_match(self, user_job_type, job_type):
        """Check if user's preferred job type matches job type"""
        try:
            if not user_job_type or not job_type:
                return False
            
            user_job_type_lower = user_job_type.lower()
            job_type_lower = job_type.lower()
            if user_job_type_lower == job_type_lower:
                return True
            if user_job_type_lower in job_type_lower or job_type_lower in user_job_type_lower:
                return True
            return False
            
        except Exception as e:
            logger.error(f"Error checking job type match: {e}")
            return False
    
    def calculate_skill_match(self, user_skills, job_text):
        """Calculate percentage of user skills mentioned in job description"""
        try:
            if not user_skills or not job_text:
                return 0.0
            
            user_skills_list = [skill.strip().lower() for skill in user_skills.split(',') if skill.strip()]
            job_text_lower = job_text.lower()
            if not user_skills_list:
                return 0.0
            
            matched_skills = 0
            for skill in user_skills_list:
                if skill and skill in job_text_lower:
                    matched_skills += 1
            return (matched_skills / len(user_skills_list)) * 100
            
        except Exception as e:
            logger.error(f"Error calculating skill match: {e}")
            return 0.0
    
    def assess_experience_match(self, user_profile, job_description):
        """Assess if user's experience level matches job requirements"""
        try:
            job_desc_lower = job_description.lower() if job_description else ""
            experience_score = 0
            
            if user_profile.get('internships'):
                experience_score += len(user_profile['internships']) * 0.5
            if user_profile.get('projects'):
                experience_score += len(user_profile['projects']) * 0.3
            
            education_keywords = ['master', 'phd', 'bachelor', 'degree']
            for edu in user_profile.get('education', []):
                degree = edu.get('degree', '').lower()
                if any(keyword in degree for keyword in education_keywords):
                    if 'master' in degree or 'phd' in degree:
                        experience_score += 2
                    elif 'bachelor' in degree:
                        experience_score += 1
            
            entry_keywords = ['entry level', 'junior', 'fresher', 'graduate', 'trainee']
            mid_keywords = ['mid level', 'experienced', '2+ years', '3+ years']
            senior_keywords = ['senior', 'lead', '5+ years', 'expert', 'principal']
            
            if any(keyword in job_desc_lower for keyword in entry_keywords):
                return experience_score >= 1
            elif any(keyword in job_desc_lower for keyword in mid_keywords):
                return experience_score >= 2
            elif any(keyword in job_desc_lower for keyword in senior_keywords):
                return experience_score >= 4
            else:
                return True
                
        except Exception as e:
            logger.error(f"Error assessing experience match: {e}")
            return True
    
    def recommend_jobs(self, user_data, jobs, top_n=10, resume_url=None):
        """Main method to recommend jobs based on user profile"""
        try:
            resume_data = None
            if resume_url:
                resume_data = self.extract_resume_data(resume_url)
            
            user_profile = self.prepare_user_profile(user_data, resume_data)
            job_vectors, job_texts = self.create_job_vectors(jobs)
            user_vector = self.create_user_vector(user_profile, job_texts)
            job_scores = self.calculate_match_scores(user_vector, job_vectors, jobs)
            
            enhanced_recommendations = []
            for job, similarity_score in job_scores[:top_n * 2]:
                try:
                    location_match = self.check_location_match(
                        user_profile.get('preferred_location', ''),
                        job.get('candidate_required_location', '')
                    )
                    job_type_match = self.check_job_type_match(
                        user_profile.get('preferred_job_type', ''),
                        job.get('job_type', '')
                    )
                    job_combined_text = ' '.join([
                        job.get('title', ''),
                        job.get('description', ''),
                        ' '.join(job.get('tags', []) if isinstance(job.get('tags', []), list) else [])
                    ])
                    skill_match_percent = self.calculate_skill_match(
                        user_profile.get('key_skills', ''),
                        job_combined_text
                    )
                    experience_match = self.assess_experience_match(
                        user_profile,
                        job.get('description', '')
                    )
                    final_score = (
                        similarity_score * 0.4 +
                        (0.2 if location_match else 0) +
                        (0.15 if job_type_match else 0) +
                        (skill_match_percent / 100) * 0.2 +
                        (0.05 if experience_match else 0)
                    )
                    recommendation = {
                        'job': job,
                        'score': final_score,
                        'criteria': {
                            'similarity_score': similarity_score,
                            'location_match': location_match,
                            'job_type_match': job_type_match,
                            'skill_match_percent': skill_match_percent,
                            'experience_match': experience_match
                        }
                    }
                    enhanced_recommendations.append(recommendation)
                except Exception as e:
                    logger.warning(f"Error processing job recommendation: {e}")
                    continue
            
            enhanced_recommendations.sort(key=lambda x: x['score'], reverse=True)
            return enhanced_recommendations[:top_n]
            
        except Exception as e:
            logger.error(f"Error in recommend_jobs: {e}")
            return []
    
    def get_recommendation_explanation(self, recommendation):
        """Generate human-readable explanation for a recommendation"""
        try:
            job = recommendation['job']
            criteria = recommendation['criteria']
            explanation_parts = []
            if criteria['similarity_score'] > 0.5:
                explanation_parts.append("Strong content match with your profile")
            elif criteria['similarity_score'] > 0.3:
                explanation_parts.append("Good content alignment")
            else:
                explanation_parts.append("Basic content relevance")
            if criteria['location_match']:
                explanation_parts.append(f"Location matches your preference")
            if criteria['job_type_match']:
                explanation_parts.append("Job type aligns with your preference")
            skill_percent = criteria['skill_match_percent']
            if skill_percent > 70:
                explanation_parts.append(f"Excellent skills match ({skill_percent:.0f}%)")
            elif skill_percent > 40:
                explanation_parts.append(f"Good skills match ({skill_percent:.0f}%)")
            elif skill_percent > 0:
                explanation_parts.append(f"Some skills match ({skill_percent:.0f}%)")
            if criteria['experience_match']:
                explanation_parts.append("Experience level appropriate")
            return "; ".join(explanation_parts) if explanation_parts else "General match based on profile"
            
        except Exception as e:
            logger.error(f"Error generating explanation: {e}")
            return "Recommended based on profile analysis"