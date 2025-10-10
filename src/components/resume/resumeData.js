const resumeData = {
    personalInfo: {
        name: "Mirav Savaliya",
        email: "miravsavaliya2004@gmail.com",
        phone: "7016867493",
        location: "Rajkot, Gujarat",
        github: "https://github.com/Mirav21",
        linkedin: "https://www.linkedin.com/in/mirav-savaliya-516242303",
    },
    sections: [
        {
            id: "section-experience",
            title: "Work Experience",
            items: [
                {
                    id: "1",
                    headings: [
                        {
                            id: "1",
                            value: "Web Development Intern",
                            placeholder: "Position",
                        },
                        {
                            id: "2",
                            value: "Heliconia Solutions Pvt. Ltd. | May 2024 – Jun 2024",
                            placeholder: "Company & Duration",
                        },
                    ],
                    textLines: [
                        {
                            id: "1",
                            value:
                                "Built a robust e-Commerce platform using Django, integrating a secure payment system that processed more than 1,000 transactions per month, reducing payment failures by 30% and improving checkout speed.",
                            placeholder: "Achievement",
                        },
                        {
                            id: "2",
                            value:
                                "Designed a comprehensive test suite that covers user authentication and key product management workflows, achieving 95% code coverage and improving application reliability across the organization.",
                            placeholder: "Achievement",
                        },
                    ],
                },
            ],
        },
        {
            id: "section-education",
            title: "Education",
            items: [
                {
                    id: "1",
                    headings: [
                        {
                            id: "1",
                            value: "Charotar University of Science and Technology, CSPIT",
                            placeholder: "University",
                        },
                        {
                            id: "2",
                            value: "Sept 2022 – May 2026",
                            placeholder: "Duration",
                        },
                    ],
                    textLines: [
                        { id: "1", value: "B.Tech in Computer Engineering", placeholder: "Degree" },
                        { id: "2", value: "CGPA: 8.62 / 10.00", placeholder: "Grade" },
                    ],
                },
                {
                    id: "2",
                    headings: [
                        {
                            id: "1",
                            value: "Dholakiya Schools, Science Stream (11th–12th)",
                            placeholder: "School",
                        },
                        {
                            id: "2",
                            value: "Jun 2020 – May 2022",
                            placeholder: "Duration",
                        },
                    ],
                    textLines: [
                        { id: "1", value: "GSEB: 69.07% — GUJCET PR: 81.30", placeholder: "Details" },
                    ],
                },
            ],
        },
        {
            id: "section-projects",
            title: "Projects",
            items: [
                {
                    id: "1",
                    headings: [
                        { id: "1", value: "Employee Governance System", placeholder: "Project Name" },
                        { id: "2", value: "Jun 2024 – Oct 2024", placeholder: "Duration" },
                    ],
                    textLines: [
                        {
                            id: "1",
                            value:
                                "Built an Employee Governance System using Django REST framework (back-end) and React-JS (front-end), managing 1,000+ employee records efficiently.",
                            placeholder: "Description",
                        },
                        {
                            id: "2",
                            value:
                                "Implemented role-based authentication, reducing unauthorized access attempts by 95% and enhancing data security. Real-time updates improved workflow efficiency by 50%.",
                            placeholder: "Achievement",
                        },
                    ],
                },
                {
                    id: "2",
                    headings: [
                        { id: "1", value: "Disaster Management Portal", placeholder: "Project Name" },
                        { id: "2", value: "Oct 2024 – Feb 2025", placeholder: "Duration" },
                    ],
                    textLines: [
                        {
                            id: "1",
                            value:
                                "Developed a Disaster Management Portal with 100% responsive UI on all devices, integrating real-time data visualization to improve disaster response time by 50%.",
                            placeholder: "Description",
                        },
                        {
                            id: "2",
                            value:
                                "Implemented an SOS alert system for instant emergency reporting and one-click social media uploads, enabling users to quickly share critical updates during disasters.",
                            placeholder: "Achievement",
                        },
                    ],
                },
                {
                    id: "3",
                    headings: [
                        { id: "1", value: "Job Recommendation System", placeholder: "Project Name" },
                        { id: "2", value: "Dec 2025 – Apr 2025", placeholder: "Duration" },
                    ],
                    textLines: [
                        {
                            id: "1",
                            value:
                                "Created a Job Recommendation System that suggests job postings (including remote opportunities) based on user profiles, with ATS score analysis and resume parsing.",
                            placeholder: "Description",
                        },
                        {
                            id: "2",
                            value:
                                "Integrated an ATS score checker to evaluate resume compatibility with job listings and provided actionable improvement suggestions.",
                            placeholder: "Achievement",
                        },
                    ],
                },
            ],
        },
        {
            id: "section-skills",
            title: "Technical Skills",
            items: [
                {
                    id: "1",
                    headings: [{ id: "1", value: "Languages", placeholder: "Category" }],
                    textLines: [
                        {
                            id: "1",
                            value: "JavaScript, TypeScript, HTML, CSS, C, C++, C#",
                            placeholder: "Skills",
                        },
                    ],
                },
                {
                    id: "2",
                    headings: [{ id: "1", value: "Frameworks & Libraries", placeholder: "Category" }],
                    textLines: [
                        {
                            id: "1",
                            value: "React.js, TailwindCSS, Django, .NET Core",
                            placeholder: "Skills",
                        },
                    ],
                },
            ],
        },
        {
            id: "section-achievements",
            title: "Achievements",
            items: [
                {
                    id: "1",
                    headings: [{ id: "1", value: "MUJHackx1.0 Hackathon – Finalist", placeholder: "Achievement" }],
                    textLines: [
                        {
                            id: "1",
                            value: "Constructed a full-stack project with ReactJS and Spring Boot, led front-end development.",
                            placeholder: "Details",
                        },
                    ],
                },
                {
                    id: "2",
                    headings: [{ id: "1", value: "MakerFest Vadodara", placeholder: "Achievement" }],
                    textLines: [
                        {
                            id: "1",
                            value: "Selected among 550+ teams, presented an innovative solution, and received feedback from industry experts.",
                            placeholder: "Details",
                        },
                    ],
                },
            ],
        },
    ],
};

export const sampleResumeData = JSON.parse(JSON.stringify(resumeData));
