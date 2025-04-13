import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/types/jobseeker";

interface ProjectFormProps {
  initialProjects?: Project[];
  onSave: (projects: Project[]) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function ProjectForm({ initialProjects = [], onSave }: ProjectFormProps) {
  const [projects, setProjects] = useState<Project[]>(
    initialProjects.length > 0 ? initialProjects : [{
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      currently_working: false,
      project_url: '',
      github_url: '',
    }]
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await Promise.all(projects.map(async (project) => {
        const url = project.id 
          ? `${API_URL}/api/v1/jobseeker/projects/${project.id}`
          : `${API_URL}/api/v1/jobseeker/projects`;
        
        const response = await fetch(url, {
          method: project.id ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(project)
        });

        if (!response.ok) {
          throw new Error(`Failed to save project.`);
        }
      }));

      toast({
        description: "Projects updated successfully",
      });
      onSave(projects);
    } catch (error) {
      toast({
        variant: "destructive",
        description: `Failed to update project`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        currently_working: false,
        project_url: '',
        github_url: '',
      }
    ]);
  };

  const removeProject = async (index: number) => {
    const project = projects[index];
    if (project.id) {
      try {
        const response = await fetch(`${API_URL}/api/v1/jobseeker/projects/${project.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete project');
        }
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to delete project",
        });
        return;
      }
    }

    const newProjects = projects.filter((_, i) => i !== index);
    setProjects(newProjects);
    onSave(newProjects);
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const newProjects = [...projects];
    newProjects[index] = {
      ...newProjects[index],
      [field]: value
    };

    if (field === 'currently_working' && value === true) {
      newProjects[index].end_date = '';
    }

    setProjects(newProjects);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {projects.map((project, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeProject(index)}
            >
              Remove
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor={`title-${index}`}>Project Title</Label>
              <Input
                id={`title-${index}`}
                value={project.title}
                onChange={(e) => updateProject(index, 'title', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor={`description-${index}`}>Description</Label>
              <Textarea
                id={`description-${index}`}
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                disabled={isLoading}
                required
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor={`start_date-${index}`}>Start Date</Label>
              <Input
                id={`start_date-${index}`}
                type="date"
                value={project.start_date ? project.start_date.split('T')[0] : ''}
                onChange={(e) => updateProject(index, 'start_date', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`currently_working-${index}`}
                checked={project.currently_working}
                onCheckedChange={(checked) => 
                  updateProject(index, 'currently_working', Boolean(checked))
                }
                disabled={isLoading}
              />
              <Label htmlFor={`currently_working-${index}`}>
                Currently Working
              </Label>
            </div>

            {!project.currently_working && (
              <div>
                <Label htmlFor={`end_date-${index}`}>End Date</Label>
                <Input
                  id={`end_date-${index}`}
                  type="date"
                  value={project.end_date ? project.end_date.split('T')[0] : ''}
                  onChange={(e) => updateProject(index, 'end_date', e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor={`project_url-${index}`}>Project URL</Label>
              <Input
                id={`project_url-${index}`}
                type="url"
                value={project.project_url}
                onChange={(e) => updateProject(index, 'project_url', e.target.value)}
                disabled={isLoading}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor={`github_url-${index}`}>GitHub URL</Label>
              <Input
                id={`github_url-${index}`}
                type="url"
                value={project.github_url}
                onChange={(e) => updateProject(index, 'github_url', e.target.value)}
                disabled={isLoading}
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={addProject}
          disabled={isLoading}
        >
          Add Project
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save All"}
        </Button>
      </div>
    </form>
  );
} 