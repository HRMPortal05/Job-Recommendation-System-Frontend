from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from datetime import datetime
import os
import requests
import json
from model import JobRecommendationTransformer  # Ensure this module exists

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize the job recommendation transformer
transformer = JobRecommendationTransformer()

# Configuration for external job API
EXTERNAL_JOB_API_URL = os.environ.get('EXTERNAL_JOB_API_URL', 'https://job-recommendation-system-backend.onrender.com/api/jobs/getRelatedJobs')
EXTERNAL_API_TIMEOUT = int(os.environ.get('EXTERNAL_API_TIMEOUT', '30'))

def fetch_jobs_from_external_api(tags, location=None, job_type=None, limit=100):
    """Fetch jobs from external API based on tags"""
    try:
        all_jobs = []
        for tag in tags:
            params = {
                'tags': tag,
                'limit': limit
            }
            if location:
                params['location'] = location
            if job_type:
                params['job_type'] = job_type
            
            headers = {
                'Content-Type': 'application/json',
            }
            auth_token = os.environ.get('EXTERNAL_API_TOKEN')
            if auth_token:
                headers['Authorization'] = f'Bearer {auth_token}'
            
            logger.info(f"Fetching jobs for tag: {tag}")
            response = requests.get(
                EXTERNAL_JOB_API_URL,
                headers=headers,
                params=params,
                timeout=EXTERNAL_API_TIMEOUT
            )
            response.raise_for_status()
            api_data = response.json()
            
            if isinstance(api_data, dict):
                jobs = api_data.get('jobs', api_data.get('data', []))
            elif isinstance(api_data, list):
                jobs = api_data
            else:
                logger.warning(f"Unexpected API response format for tag {tag}: {type(api_data)}")
                jobs = []
            
            all_jobs.extend(jobs)
        
        # Remove duplicates based on job ID
        unique_jobs = {job.get('id', job.get('job_id', job.get('_id', str(i)))): job for i, job in enumerate(all_jobs)}.values()
        logger.info(f"Fetched {len(unique_jobs)} unique jobs from external API")
        return list(unique_jobs)
        
    except requests.RequestException as e:
        logger.error(f"Error fetching jobs from external API: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching jobs: {e}")
        return []

def normalize_job_data(jobs):
    """Normalize job data from external API to expected format"""
    normalized_jobs = []
    for job in jobs:
        try:
            if not isinstance(job, dict):
                logger.warning(f"Skipping non-dict job: {job}")
                continue
            normalized_job = {
                'id': str(job.get('id') or job.get('job_id') or job.get('_id') or hash(str(job))),
                'title': str(job.get('title') or job.get('job_title') or job.get('position') or 'Unknown Job'),
                'company_name': str(job.get('company_name') or job.get('company') or job.get('employer') or 'Unknown Company'),
                'category': str(job.get('category') or job.get('job_category') or job.get('department') or ''),
                'tags': job.get('tags') or job.get('skills') or job.get('keywords', []),
                'job_type': str(job.get('job_type') or job.get('employment_type') or job.get('type') or ''),
                'publication_date': str(job.get('publication_date') or job.get('posted_date') or job.get('created_at') or ''),
                'candidate_required_location': str(job.get('candidate_required_location') or job.get('location') or job.get('city') or ''),
                'description': str(job.get('description') or job.get('job_description') or job.get('details', '') or ''),
                'salary': str(job.get('salary') or job.get('salary_range') or ''),
                'experience_required': str(job.get('experience_required') or job.get('experience_level') or ''),
                'application_url': str(job.get('application_url') or job.get('apply_url') or ''),
                'remote_allowed': job.get('remote_allowed') or job.get('is_remote', False)
            }
            
            # Handle tags formatting
            if isinstance(normalized_job['tags'], str):
                try:
                    parsed_tags = json.loads(normalized_job['tags'])
                    if isinstance(parsed_tags, list):
                        cleaned_tags = [str(tag).strip('[]"') for tag in parsed_tags if tag]
                        normalized_job['tags'] = [', '.join(cleaned_tags)] if cleaned_tags else []
                    else:
                        logger.warning(f"Parsed tags is not a list: {parsed_tags}")
                        normalized_job['tags'] = [normalized_job['tags'].strip('[]').replace('"', '')]
                except json.JSONDecodeError:
                    cleaned_tags = [tag.strip('[]"') for tag in normalized_job['tags'].split(',') if tag.strip('[]"')]
                    normalized_job['tags'] = [', '.join(cleaned_tags)] if cleaned_tags else []
            elif isinstance(normalized_job['tags'], list):
                cleaned_tags = [str(tag).strip('[]"') for tag in normalized_job['tags'] if tag]
                normalized_job['tags'] = [', '.join(cleaned_tags)] if cleaned_tags else []
            else:
                logger.warning(f"Unexpected tags format: {normalized_job['tags']}")
                normalized_job['tags'] = []
            
            if not normalized_job['id'] or normalized_job['title'] == 'Unknown Job':
                logger.warning(f"Job missing id or title: {normalized_job}")
            normalized_jobs.append(normalized_job)
                
        except Exception as e:
            logger.warning(f"Error normalizing job data: {e}, job: {job}")
            continue
    
    logger.info(f"Normalized {len(normalized_jobs)} jobs out of {len(jobs)} raw jobs")
    return normalized_jobs

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        "message": "Job Recommendation API is running",
        "status": "healthy",
        "timestamp": str(datetime.now().isoformat()),
        "external_api_configured": bool(os.environ.get('EXTERNAL_JOB_API_URL'))
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Detailed health check endpoint"""
    external_api_status = "not_configured"
    if os.environ.get('EXTERNAL_JOB_API_URL'):
        try:
            response = requests.get(
                os.environ.get('EXTERNAL_JOB_API_URL'),
                timeout=5,
                params={'limit': 1}
            )
            external_api_status = "healthy" if response.status_code == 200 else "error"
        except:
            external_api_status = "unreachable"
    
    return jsonify({
        "status": "healthy",
        "service": "Job Recommendation API",
        "version": "2.0.0",
        "timestamp": str(datetime.now().isoformat()),
        "external_job_api": {
            "configured": bool(os.environ.get('EXTERNAL_JOB_API_URL')),
            "status": external_api_status,
            "url": os.environ.get('EXTERNAL_JOB_API_URL', 'not_configured')
        }
    })

@app.route('/api/recommend', methods=['POST'])
def recommend_jobs():
    """Main endpoint for job recommendations"""
    try:
        if not request.is_json:
            return jsonify({
                "error": "Request must be JSON",
                "status": "error"
            }, 400)

        user_data = request.get_json()
        if not user_data:
            return jsonify({
                "error": "No user data provided",
                "status": "error"
            }, 400)

        top_n = request.args.get('top_n', 10, type=int)
        top_n = min(max(top_n, 1), 50)
        fetch_limit = request.args.get('fetch_limit', 100, type=int)
        fetch_limit = min(max(fetch_limit, 10), 500)

        user_tags = transformer.extract_user_tags(user_data)
        if not user_tags or user_tags == ['general']:
            logger.warning("No specific tags extracted, using fallback tags")
            user_tags = ['java', 'software engineer', 'full-time']
            logger.info(f"Using fallback tags: {user_tags}")

        logger.info(f"Extracted user tags: {user_tags}")
        preferred_location = user_data.get('preferedLocation')
        preferred_job_type = user_data.get('preferedJobType')
        
        raw_jobs = fetch_jobs_from_external_api(
            tags=user_tags,
            location=preferred_location,
            job_type=preferred_job_type,
            limit=fetch_limit
        )
        
        if not raw_jobs:
            logger.warning("No jobs fetched from external API, using fallback jobs")
            raw_jobs = [
                {
                    'id': 'fallback_1',
                    'title': 'Java Developer',
                    'company_name': 'Fallback Inc.',
                    'category': 'Software Development',
                    'tags': ['java', 'springboot', 'postgresql'],
                    'job_type': 'Full-Time',
                    'candidate_required_location': 'Bangalore',
                    'description': 'Develop Java-based applications using Springboot and PostgreSQL.',
                    'remote_allowed': False
                }
            ]
        
        jobs_data = normalize_job_data(raw_jobs)
        if not jobs_data:
            logger.error(f"No valid jobs after normalization, raw jobs: {len(raw_jobs)}")
            jobs_data = normalize_job_data([{
                'id': 'fallback_1',
                'title': 'Java Developer',
                'company_name': 'Fallback Inc.',
                'category': 'Software Development',
                'tags': ['java', 'springboot', 'postgresql'],
                    'job_type': 'Full-Time',
                    'candidate_required_location': 'Bangalore',
                    'description': 'Develop Java-based applications using Springboot and PostgreSQL.',
                    'remote_allowed': False
                }
            ])
        
        logger.info(f"Normalized {len(jobs_data)} jobs for recommendation")
        resume_url = user_data.get('users', {}).get('resumeUrl', '') or user_data.get('resumeUrl', '')
        recommendations = transformer.recommend_jobs(user_data, jobs_data, top_n, resume_url)
        
        if not recommendations:
            return jsonify({
                "error": "No recommendations generated",
                "status": "error",
                "jobs_processed": len(jobs_data)
            }, 404)

        formatted_recommendations = []
        for i, rec in enumerate(recommendations):
            job = rec['job']
            score = rec['score']
            criteria = rec['criteria']
            formatted_rec = {
                "rank": i + 1,
                "job_id": job.get('id'),
                "title": job.get('title'),
                "company": job.get('company_name'),
                "category": job.get('category'),
                "location": job.get('candidate_required_location'),
                "job_type": job.get('job_type'),
                "tags": job.get('tags', []),
                "publication_date": job.get('publication_date'),
                "description": job.get('description', ''),
                "salary": job.get('salary'),
                "experience_required": job.get('experience_required'),
                "application_url": job.get('application_url'),
                "remote_allowed": job.get('remote_allowed'),
                "match_score": round(score, 3),
                "match_criteria": {
                    "similarity_score": round(criteria['similarity_score'], 3),
                    "location_match": criteria['location_match'],
                    "job_type_match": criteria['job_type_match'],
                    "skill_match_percent": round(criteria['skill_match_percent'], 2),
                    "experience_match": criteria['experience_match']
                },
                "explanation": transformer.get_recommendation_explanation(rec)
            }
            formatted_recommendations.append(formatted_rec)

        response = {
            "status": "success",
            "message": f"Found {len(formatted_recommendations)} job recommendations",
            "total_recommendations": len(formatted_recommendations),
            "user_profile": {
                "name": f"{user_data.get('users', {}).get('firstName', '')} {user_data.get('users', {}).get('lastName', '')}".strip(),
                "email": user_data.get('users', {}).get('email', ''),
                "preferred_location": user_data.get('preferedLocation', ''),
                "preferred_job_type": user_data.get('preferedJobType', ''),
                "key_skills": user_data.get('keySkills', ''),
                "extracted_tags": user_tags
            },
            "api_info": {
                "jobs_fetched": len(raw_jobs),
                "jobs_processed": len(jobs_data),
                "external_api_url": os.environ.get('EXTERNAL_JOB_API_URL', 'not_configured')
            },
            "recommendations": formatted_recommendations,
            "timestamp": str(datetime.now().isoformat())
        }

        return jsonify(response)

    except Exception as e:
        logger.error(f"Error in recommend_jobs: {str(e)}")
        return jsonify({
            "error": "Internal server error occurred while processing recommendations",
            "status": "error",
            "timestamp": str(datetime.now().isoformat())
        }, 500)

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Endpoint not found",
        "status": "error",
        "message": "The requested endpoint does not exist"
    }, 404)

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        "error": "Method not allowed",
        "status": "error",
        "message": "The HTTP method is not allowed for this endpoint"
    }, 405)

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "error": "Internal server error",
        "status": "error",
        "message": "An unexpected error occurred"
    }, 500)

# Export the Flask app for Vercel
gunicorn_app = app