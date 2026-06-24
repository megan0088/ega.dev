#!/usr/bin/env python3
"""
ATS-friendly CV generator for Muhamad Ega Nugraha.
Single-column, standard fonts, selectable text — safe for ATS parsers.

Run:
    /tmp/cvbuild/bin/python scripts/generate_cv.py
Output:
    public/Muhamad-Ega-Nugraha-CV.pdf
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable,
)
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
import os

# ---------------------------------------------------------------- colors
INK      = HexColor("#111111")   # body text
MUTED    = HexColor("#444444")   # secondary text
ACCENT   = HexColor("#0A66C2")   # links / headings accent (LinkedIn-ish blue)
RULE     = HexColor("#CCCCCC")

# ---------------------------------------------------------------- styles
styles = getSampleStyleSheet()

def style(name, **kw):
    return ParagraphStyle(name, parent=styles["Normal"], **kw)

s_name = style("Name", fontName="Helvetica-Bold", fontSize=17, leading=19,
               textColor=INK, spaceAfter=1)
s_role = style("Role", fontName="Helvetica", fontSize=9.5, leading=12,
               textColor=ACCENT, spaceAfter=3)
s_contact = style("Contact", fontName="Helvetica", fontSize=8.2, leading=11,
                  textColor=MUTED)
s_section = style("Section", fontName="Helvetica-Bold", fontSize=9.3, leading=11,
                  textColor=INK, spaceBefore=5, spaceAfter=1)
s_body = style("Body", fontName="Helvetica", fontSize=8.4, leading=10.8,
               textColor=INK, alignment=TA_LEFT, spaceAfter=1)
s_jobtitle = style("JobTitle", fontName="Helvetica-Bold", fontSize=8.8, leading=11,
                   textColor=INK)
s_jobmeta = style("JobMeta", fontName="Helvetica-Oblique", fontSize=8, leading=10,
                  textColor=MUTED, spaceAfter=1)
s_bullet = style("Bullet", fontName="Helvetica", fontSize=8.4, leading=10.6,
                 textColor=INK, leftIndent=9, bulletIndent=0, spaceAfter=0.5)
s_skill = style("Skill", fontName="Helvetica", fontSize=8.4, leading=10.8,
                textColor=INK, spaceAfter=0.5)

def section(title):
    return [Paragraph(title.upper(), s_section),
            HRFlowable(width="100%", thickness=0.6, color=RULE,
                       spaceBefore=1, spaceAfter=2)]

def bullets(items):
    return [Paragraph(f"&bull;&nbsp;&nbsp;{t}", s_bullet) for t in items]

def job(title, meta, items):
    flow = [Paragraph(title, s_jobtitle), Paragraph(meta, s_jobmeta)]
    flow += bullets(items)
    flow.append(Spacer(1, 2))
    return flow

def skill_row(label, value):
    return Paragraph(f'<b>{label}:</b> {value}', s_skill)

# ---------------------------------------------------------------- build
elements = []

# Header
elements.append(Paragraph("Muhamad Ega Nugraha", s_name))
elements.append(Paragraph("iOS Developer&nbsp; &middot; &nbsp;AI Engineer&nbsp; &middot; &nbsp;Product Manager", s_role))
elements.append(Paragraph(
    "Kota Bogor, Indonesia&nbsp; &bull; &nbsp;+62 812-9314-8932&nbsp; &bull; &nbsp;"
    '<a href="mailto:eganugrahaworkspace@gmail.com" color="#0A66C2">eganugrahaworkspace@gmail.com</a>',
    s_contact))
elements.append(Paragraph(
    '<a href="https://linkedin.com/in/ega-nugraha" color="#0A66C2">linkedin.com/in/ega-nugraha</a>'
    "&nbsp; &bull; &nbsp;"
    '<a href="https://github.com/megan0088" color="#0A66C2">github.com/megan0088</a>'
    "&nbsp; &bull; &nbsp;"
    '<a href="https://ega-dev.vercel.app" color="#0A66C2">ega-dev.vercel.app</a>',
    s_contact))
elements.append(Spacer(1, 2))
elements.append(HRFlowable(width="100%", thickness=1.1, color=INK, spaceAfter=1))

# Summary
elements += section("Summary")
elements.append(Paragraph(
    "Multidisciplinary technologist blending <b>iOS development, AI engineering, and product "
    "management</b>. Currently a Learner at the <b>Apple Developer Academy</b> (BINUS, Cohort 9), "
    "building native iOS apps with Swift and SwiftUI while applying AI/ML to real product problems "
    "and driving features from concept to launch. Diploma in Computer Engineering, with prior "
    "experience across enterprise SAP B1 integration, full-stack web (Next.js), Flutter mobile, and IoT.",
    s_body))

# Core Skills
elements += section("Core Skills")
elements.append(skill_row("iOS Development",
    "Swift, SwiftUI, UIKit, Combine, Core Data, SwiftData, SpriteKit, ARKit, RealityKit, watchOS, App Store Connect, Xcode"))
elements.append(skill_row("AI Engineering",
    "Python, Prompt Engineering, LLM Integration (OpenAI / Claude), RAG, LangChain, Hugging Face, PyTorch / TensorFlow, Pandas / NumPy, Vector DBs (pgvector / Pinecone), OpenRouter API"))
elements.append(skill_row("Product &amp; Design",
    "Product Thinking, Design Thinking, Challenge-Based Learning, UI/UX, Rapid Prototyping, Figma, Agile Collaboration"))
elements.append(skill_row("Full-Stack &amp; Other",
    "Next.js / React, TypeScript, Flutter / Dart, Tailwind CSS, Supabase / PostgreSQL, Firebase, REST APIs, SAP B1 (C# / .NET), Git"))

# Experience
elements += section("Experience")
elements += job(
    "Learner &mdash; Apple Developer Academy",
    "BINUS &middot; Cohort 9&nbsp; |&nbsp; Mar 2026 &ndash; Present",
    [
        "Building native iOS apps with Swift and SwiftUI through Apple&rsquo;s Challenge-Based Learning curriculum.",
        "Applying design thinking and UI/UX to turn real-world problems into intuitive products.",
        "Collaborating in multidisciplinary teams (design, tech, product) to ship apps end-to-end.",
    ])
elements += job(
    "SAP B1 Technical Consultant &mdash; Soltius Indonesia",
    "Aug 2025 &ndash; Mar 2026",
    [
        "Developed custom Add-ons and modifications using the SAP B1 SDK (C# / .NET).",
        "Optimized stored procedures, views, and complex queries for SAP HANA and MS SQL Server.",
        "Integrated SAP with AI systems; built reports (Crystal / HANA) and provided advanced technical support.",
    ])
elements += job(
    "IT Officer &mdash; PT Duta Kecantikan Indonesia",
    "Jan 2023 &ndash; Apr 2023",
    [
        "Built and launched a WordPress marketplace (dutacantikindonesia.com); maintained network, hardware, and NComputing.",
    ])

# Selected Projects
elements += section("Selected Projects")
projects = [
    ("Nusantara Chess (iOS)",
     "3D chess game in SwiftUI + RealityKit with a Negamax + alpha-beta AI (3 difficulty levels) and a Majapahit vs Sriwijaya cultural theme."),
    ("Jarvis &mdash; Virtual Pet Wellness Assistant (iOS + macOS)",
     "Habit-building virtual pet using SwiftUI, SpriteKit, ActivityKit (Live Activities), and AppKit for a desktop Buddy Mode."),
    ("Hello Coach (iOS + watchOS)",
     "Push/pull workout tracker with SwiftData persistence and training-volume analytics across muscle groups."),
    ("Karir AI (AI)",
     "LLM-powered career-guidance mobile app integrating OpenRouter for chat-based recommendations. Flutter."),
    ("Plate Recognition (AI)",
     "License-plate OCR pipeline with Python, OpenCV, and Tesseract, served to a Flutter client over REST."),
    ("Holticura (IoT)",
     "Smart horticulture monitoring with ESP8266 sensors and Blynk. Arduino / C++."),
]
for title, desc in projects:
    elements.append(Paragraph(f"<b>{title}.</b> {desc}", s_bullet))

# Honors & Competitions
elements += section("Honors &amp; Competitions")
elements += bullets([
    "<b>Hacker</b> &mdash; Kompetisi Innovator Muda (2024): built a full business case and working prototype (SiapAda) in one day.",
    "<b>Front-End Developer</b> &mdash; GOTO Hackathon (2023): built and pitched a mobile marketplace app in one day.",
])

# Additional Experience (outside core focus)
elements += section("Additional Experience")
elements += bullets([
    "<b>Traffic Officer</b> &mdash; Freelance (JMTO) &middot; Apr 2024 &ndash; Apr 2025 &mdash; managed toll-road traffic control during peak holiday season.",
    "<b>Voting Committee (PPS)</b> &mdash; KPU, General Elections Commission &middot; Jun 2023 &ndash; Jan 2024 &mdash; organized and supervised transparent local voting.",
    "<b>IT Helper</b> &mdash; PT Batik Organik &middot; Mar 2023 &ndash; Oct 2023 &mdash; digitalized product inventory and migrated the database to a cloud server.",
])

# Education
elements += section("Education")
elements.append(Paragraph("<b>Diploma in Computer Engineering</b> &mdash; IPB University", s_jobtitle))
elements.append(Paragraph("Aug 2019 &ndash; Sep 2022&nbsp; |&nbsp; Focus: IoT, hardware programming, and software development", s_jobmeta))

# Languages
elements += section("Languages")
elements.append(Paragraph("Indonesian (Native) &nbsp;&bull;&nbsp; English (Professional working proficiency)", s_body))

# ---------------------------------------------------------------- render
out_dir = os.path.join(os.path.dirname(__file__), "..", "public")
out_path = os.path.abspath(os.path.join(out_dir, "Muhamad-Ega-Nugraha-CV.pdf"))

doc = SimpleDocTemplate(
    out_path, pagesize=A4,
    leftMargin=16*mm, rightMargin=16*mm, topMargin=14*mm, bottomMargin=12*mm,
    title="Muhamad Ega Nugraha - CV",
    author="Muhamad Ega Nugraha",
    subject="iOS Developer, AI Engineer, Product Manager",
)
doc.build(elements)
print("Wrote", out_path)
