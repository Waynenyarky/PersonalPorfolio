import { ArrowUp, Code } from 'lucide-react';
import type { Project } from '../types/project';
import Card from './Card';
import Tag from './Tag';
import Badge from './Badge';

type Props = {
	project: Project;
	index: number;
	bgCardClass: string;
	borderBaseClass: string;
	textPrimaryClass: string;
	textSecondaryClass: string;
	visible: boolean;
	onSelect: (project: Project) => void;
};

export default function ProjectCard({ project, index, bgCardClass, borderBaseClass, textPrimaryClass, textSecondaryClass, visible, onSelect }: Props) {
	return (
		<Card
			key={project.id}
			onClick={() => onSelect(project)}
			bgCardClass={`${bgCardClass} cursor-pointer`}
			borderBaseClass={borderBaseClass}
			className={`${visible ? 'animate-fade-in-up' : 'opacity-0'} relative overflow-hidden`}
			style={{ animationDelay: `${index * 0.08}s` }}
			interactive
		>
			<div className={`aspect-16/10 bg-linear-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
				<div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
				<Code className="text-white/80 group-hover:text-white transition-all duration-300 group-hover:scale-110" size={48} />
				<div className="absolute top-4 left-4 z-10">
					<Badge color="orange">{project.category}</Badge>
				</div>
				<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
					<div className="w-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
						<div className="flex items-center justify-between gap-3">
							<div className="flex-1 min-w-0">
								<h4 className="text-white text-base font-bold mb-1 truncate">{project.title}</h4>
								<p className="text-white/70 text-xs line-clamp-1">{project.tech.split(',').slice(0, 3).join(', ')}</p>
							</div>
							<div className="shrink-0 bg-white/20 backdrop-blur-sm rounded-lg p-2">
								<ArrowUp className="text-white rotate-45" size={16} />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="p-6">
				<h3 className={`text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-orange-500 ${textPrimaryClass} leading-tight`}>
					{project.title}
				</h3>
				<div className="mb-4">
					<div className="flex flex-wrap gap-2">
						{project.tech
							.split(',')
							.map((t) => t.trim())
							.filter(Boolean)
							.slice(0, 5)
							.map((tag, i) => (
								<Tag key={i} borderBaseClass={borderBaseClass} textSecondaryClass={textSecondaryClass}>{tag}</Tag>
							))}
					</div>
				</div>
				<div className={`pt-4 border-t ${borderBaseClass} flex items-center justify-between`}>
					<span className={`text-xs font-medium ${textSecondaryClass} group-hover:text-orange-500 transition-colors`}>View Project</span>
					<div className="flex items-center gap-2 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						<ArrowUp className="rotate-45" size={14} />
					</div>
				</div>
			</div>
		</Card>
	);
}


