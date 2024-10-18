import { Project } from "@/types/Project";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 15 }}
      >
        <div className="relative h-64">
          <Image
            src={project.image}
            alt={project.title}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent" />
          <h2 className="absolute bottom-4 left-6 text-3xl font-bold text-white">
            {project.title}
          </h2>
        </div>
        <div className="p-6">
          <p className="text-gray-300 mb-6 text-lg">
            {project.longDescription}
          </p>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-accent mb-3">
              Key Features:
            </h3>
            <ul className="space-y-2">
              {project.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-accent mb-3">
              Technologies Used:
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="bg-gray-700 text-accent text-sm px-3 py-1 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="flex space-x-4">
            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-secondary font-semibold px-6 py-3 rounded-full hover:bg-opacity-90 transition duration-300"
              >
                Live Demo
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gray-700 text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-600 transition duration-300"
              >
                GitHub Repo
              </a>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-primary transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModal;
