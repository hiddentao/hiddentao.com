import styled from '@emotion/styled'
import { flex } from 'emotion-styled-utils'
import React from "react"

import Image from "../components/image"
import Layout from "../components/layout"
import MaxContentWidth from "../components/maxContentWidth"
import SEO from "../components/seo"

const Content = styled(MaxContentWidth)`
  max-width: 90%;
`

const PageTitle = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.textColor};
`

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  justify-items: center;

  ${({ theme }) => theme.media.when({ minW: 'desktop' })} {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto 3rem;
  }
`

const ProjectCard = styled.div`
  background-color: ${({ theme }) => theme.section.bgColor};
  border: 1px solid ${({ theme }) => theme.section.borderColor};
  border-radius: 10px;
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  max-width: 350px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px ${({ theme }) => theme.section.shadowColor};
  }
`

const ProjectImage = styled.div`
  width: 100%;
  max-width: 320px;
  height: 200px;
  background-color: ${({ theme }) => theme.blockquote.bgColor};
  border-radius: 8px;
  margin: 0 auto 1rem;
  ${flex({ direction: 'column', justify: 'center', align: 'center' })};
  color: ${({ theme }) => theme.blockquote.textColor};
  font-style: italic;
  text-align: center;
  border: 2px dashed ${({ theme }) => theme.section.borderColor};
  cursor: pointer;
  transition: opacity 0.2s ease;
  overflow: hidden;

  &:hover {
    opacity: 0.8;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
  }
`

const ProjectTitle = styled.h3`
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.section.textColor};
  text-align: center;
`

const ProjectDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.section.textColor};
  margin-bottom: 1rem;
  text-align: center;
`

const ProjectLink = styled.a`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.button.bgColor};
  color: ${({ theme }) => theme.button.textColor};
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.button.hoverBgColor};
    color: ${({ theme }) => theme.button.hoverTextColor};
  }
`

const projects = [
  {
    id: 'cloudscape',
    name: 'Cloudscape',
    description: 'Pixelated clouds in the browser.',
    url: 'https://clouds.hiddentao.com',
    image: 'project-clouds.gif'
  }
]

const ProjectsPage = () => {
  return (
    <Layout>
      <SEO title="Projects" description="Portfolio of projects and creative works by Ram" />
      <Content>
        <PageTitle>Projects</PageTitle>
        <ProjectsGrid>
          {projects.map(project => (
            <ProjectCard key={project.id}>
              <ProjectImage 
                as="a"
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {project.image ? (
                  <Image src={project.image} alt={project.name} />
                ) : (
                  <div>640x480 placeholder image</div>
                )}
              </ProjectImage>
              <ProjectTitle>{project.name}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </Content>
    </Layout>
  )
}

export default ProjectsPage 