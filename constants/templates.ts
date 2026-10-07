// import { init } from "next/dist/compiled/webpack/webpack";

// export const templates = [
//   {
//     id: "blank",
//     label: "Blank Document",
//     imageUrl: "/blank-document.svg",
//   },
//   {
//     id: "business-letter",
//     label: "Business Letter",
//     imageUrl: "/business-letter.svg",
//     initialContent:`

//     `
//   },
//   {
//     id: "cover-letter",
//     label: "Cover Letter",
//     imageUrl: "/cover-letter.svg",
//   },
//   {
//     id: "letter",
//     label: "Letter",
//     imageUrl: "/letter.svg",
//   },
//   {
//     id: "project-proposal",
//     label: "Project Proposal",
//     imageUrl: "/project-proposal.svg",
//   },
//   {
//     id: "resume",
//     label: "Resume",
//     imageUrl: "/resume.svg",
//   },
//   {
//     id: "software-proposal",
//     label: "Software Proposal",
//     imageUrl: "/software-proposal.svg",
//     initialContent:`

//     `
//   },
// ];


export const templates = [
  {
    id: "blank",
    label: "Blank Document",
    imageUrl: "/blank-document.svg",
    initialContent: `
      <h1>Untitled Document</h1>
      <p>Start writing your content here...</p>
    `
  },

  {
    id: "business-letter",
    label: "Business Letter",
    imageUrl: "/business-letter.svg",
    initialContent: `
      <h1 style="text-align:center;">Business Letter</h1>

      <p><strong>Your Name</strong><br/>
      Your Company<br/>
      City, Country<br/>
      Email: your@email.com</p>

      <p><strong>Date:</strong> {{DATE}}</p>

      <p><strong>Recipient Name</strong><br/>
      Company Name<br/>
      Address<br/>
      City, Country</p>

      <p>Dear Sir/Madam,</p>

      <p>
      I am writing to you regarding an important business matter. 
      Our company has been working to provide innovative solutions 
      and we believe there is a great opportunity for collaboration 
      between our organizations.
      </p>

      <p>
      Please feel free to contact us if you would like to discuss 
      potential partnerships or require further information.
      </p>

      <p>Sincerely,<br/>
      <strong>Your Name</strong></p>
    `
  },

  {
    id: "cover-letter",
    label: "Cover Letter",
    imageUrl: "/cover-letter.svg",
    initialContent: `
      <h1>Cover Letter</h1>

      <p><strong>Your Name</strong><br/>
      Address<br/>
      City, Country<br/>
      Email | Phone</p>

      <p><strong>Date:</strong> {{DATE}}</p>

      <p><strong>Hiring Manager</strong><br/>
      Company Name</p>

      <p>Dear Hiring Manager,</p>

      <p>
      I am writing to express my interest in the position at your company.
      With my strong background in problem-solving, teamwork, and 
      technical expertise, I believe I can contribute meaningfully 
      to your team.
      </p>

      <p>
      During my previous experience, I have developed skills in 
      software development, communication, and project management.
      I am excited about the opportunity to bring my skills to your company.
      </p>

      <p>
      Thank you for considering my application. I look forward to 
      discussing my qualifications further.
      </p>

      <p>Sincerely,<br/>
      <strong>Your Name</strong></p>
    `
  },

  {
    id: "letter",
    label: "Letter",
    imageUrl: "/letter.svg",
    initialContent: `
      <h1>Personal Letter</h1>

      <p><strong>Date:</strong> {{DATE}}</p>

      <p>Dear Friend,</p>

      <p>
      I hope this letter finds you well. I wanted to take a moment
      to write and share some updates with you. Life has been busy
      but exciting, and I hope everything is going great on your side as well.
      </p>

      <p>
      Looking forward to hearing from you soon. Take care!
      </p>

      <p>Warm regards,<br/>
      <strong>Your Name</strong></p>
    `
  },

  {
    id: "project-proposal",
    label: "Project Proposal",
    imageUrl: "/project-proposal.svg",
    initialContent: `
      <h1 style="text-align:center;">Project Proposal</h1>

      <h2>Project Overview</h2>
      <p>
      This proposal outlines the objectives, scope, and expected outcomes 
      of the proposed project.
      </p>

      <h2>Objectives</h2>
      <ul>
        <li>Define clear project goals</li>
        <li>Deliver high-quality results</li>
        <li>Meet deadlines efficiently</li>
      </ul>

      <h2>Scope</h2>
      <p>
      The project will involve research, development, and testing phases.
      Each stage will ensure the project aligns with business requirements.
      </p>

      <h2>Timeline</h2>
      <table>
        <tr>
          <th>Phase</th>
          <th>Duration</th>
        </tr>
        <tr>
          <td>Planning</td>
          <td>2 Weeks</td>
        </tr>
        <tr>
          <td>Development</td>
          <td>4 Weeks</td>
        </tr>
        <tr>
          <td>Testing</td>
          <td>2 Weeks</td>
        </tr>
      </table>
    `
  },

  {
    id: "resume",
    label: "Resume",
    imageUrl: "/resume.svg",
    initialContent: `
      <h1>Your Name</h1>
      <p>Email | Phone | LinkedIn</p>

      <h2>Professional Summary</h2>
      <p>
      Motivated professional with strong experience in software development,
      teamwork, and problem-solving.
      </p>

      <h2>Skills</h2>
      <ul>
        <li>JavaScript / TypeScript</li>
        <li>React / Next.js</li>
        <li>Node.js</li>
        <li>Problem Solving</li>
      </ul>

      <h2>Experience</h2>
      <p><strong>Company Name</strong> — Software Developer</p>
      <p>Worked on building scalable web applications and improving performance.</p>

      <h2>Education</h2>
      <p>Bachelor's Degree in Computer Science</p>
    `
  },

  {
    id: "software-proposal",
    label: "Software Proposal",
    imageUrl: "/software-proposal.svg",
    initialContent: `
      <h1 style="text-align:center;">Software Development Proposal</h1>

      <h2>Introduction</h2>
      <p>
      This document outlines the proposal for developing a modern software solution
      to address business needs.
      </p>

      <h2>Proposed Solution</h2>
      <p>
      The solution will include a scalable web platform built with modern
      technologies such as React, Node.js, and cloud infrastructure.
      </p>

      <h2>Features</h2>
      <ul>
        <li>User Authentication</li>
        <li>Real-time collaboration</li>
        <li>Data analytics dashboard</li>
        <li>Secure cloud storage</li>
      </ul>

      <h2>Estimated Timeline</h2>
      <table>
        <tr>
          <th>Stage</th>
          <th>Time</th>
        </tr>
        <tr>
          <td>Requirement Analysis</td>
          <td>1 Week</td>
        </tr>
        <tr>
          <td>Development</td>
          <td>6 Weeks</td>
        </tr>
        <tr>
          <td>Testing</td>
          <td>2 Weeks</td>
        </tr>
      </table>
    `
  },
];