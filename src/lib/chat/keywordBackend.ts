import { files } from '../../content/files'
import { projects } from '../../content/projects'
import type { ChatBackend, ChatReply } from '../../types/chat'

function answer(query: string, activeFileId: string | null): ChatReply {
  const q = query.toLowerCase().trim()

  if (/\b(feed|food|eat|rice|onigiri)\b/.test(q)) {
    return { text: 'nom nom 🍙', petAction: 'feed' }
  }
  if (/\b(play|backflip|hiyah)\b/.test(q)) {
    return { text: 'hiyah! ', petAction: 'play' }
  }
  if (/\b(plain|simple|simpler)\b/.test(q)) {
    return { text: 'Switching to the plain view.', switchToPlain: true }
  }
  if (/this page|current (page|file)/.test(q)) {
    const file = files.find(({ id }) => id === activeFileId)
    if (!file) return { text: 'No file is open yet. Try projects or about.' }
    const project = projects.find(({ id }) => id === file.id)
    return {
      text: project
        ? `You're viewing ${project.n}: ${project.d}`
        : `You're viewing ${file.name}.`,
    }
  }
  if (/\b(omarchy|layout|interface)\b/.test(q)) {
    return {
      text: 'This portfolio uses an editor, explorer, terminal, and profile pane.',
    }
  }
  if (/\b(experience|education|school|university)\b/.test(q)) {
    return {
      text: 'Open experience.md for education and experience.',
      openFile: 'experience',
    }
  }
  if (/\b(resume|cv)\b/.test(q)) {
    return {
      text: 'Open resume.pdf for the resume preview.',
      openFile: 'resume',
    }
  }
  if (/\b(projects?|built|work)\b/.test(q)) {
    return {
      text: 'Here are the projects. Pick one to explore.',
      openFile: 'projects',
      cards: projects.map((project) => ({
        fileId: project.id,
        title: project.n,
        description: project.d,
      })),
    }
  }
  if (/\b(skills?|stack|tools)\b/.test(q)) {
    return { text: 'Open skills.json to see the stack.', openFile: 'skills' }
  }
  if (/\b(about|who|yourself)\b/.test(q)) {
    return { text: 'Open about.md to learn more.', openFile: 'about' }
  }
  if (/\b(contact|socials?|email|reach)\b/.test(q)) {
    return { text: 'Open contact.txt for contact links.', openFile: 'contact' }
  }
  if (/\b(hi|hello|hey)\b/.test(q)) {
    return {
      text: 'Hi! I’m Byte 🐉 Ask me about projects, experience, resume, or contact.',
    }
  }
  return {
    text: "I'm just a tiny dragon ninja 🐉 Try: projects, experience, resume, contact.",
  }
}

export const keywordBackend: ChatBackend = {
  async reply(query, context) {
    return answer(query, context.activeFileId)
  },
}
