import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { WorkExperience } from "@/types/jobseeker";

interface WorkExperienceFormProps {
  initialExperiences?: WorkExperience[];
  onSave: (experiences: WorkExperience[]) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function WorkExperienceForm({ initialExperiences = [], onSave }: WorkExperienceFormProps) {
  const [experiences, setExperiences] = useState<WorkExperience[]>(
    initialExperiences.length > 0 ? initialExperiences : [{ 
      title: '',
      company_name: '',
      joined_date: '',
      end_date: '',
      currently_working: false,
    }]
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save all experiences
      await Promise.all(experiences.map(async (exp) => {
        const url = exp.id 
          ? `${API_URL}/api/v1/jobseeker/experience/${exp.id}`
          : `${API_URL}/api/v1/jobseeker/experience`;
        
        const response = await fetch(url, {
          method: exp.id ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(exp)
        });

        if (!response.ok) {
          throw new Error('Failed to save work experience');
        }
      }));

      toast({
        description: "Work experience updated successfully",
      });
      onSave(experiences);
    } catch (error) {
      console.log(experiences);
      toast({
        variant: "destructive",
        description: "Failed to update work experience",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        title: '',
        company_name: '',
        joined_date: '',
        end_date: '',
        currently_working: false,
      }
    ]);
  };

  const removeExperience = async (index: number) => {
    const experience = experiences[index];
    if (experience.id) {
      try {
        const response = await fetch(`${API_URL}/api/v1/jobseeker/experience/${experience.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete experience');
        }
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to delete experience",
        });
        return;
      }
    }

    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);
    onSave(newExperiences);
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const newExperiences = [...experiences];
    newExperiences[index] = { 
      ...newExperiences[index], 
      [field]: value 
    };
    
    if (field === 'currently_working' && value === true) {
      newExperiences[index].end_date = '';
    }
    
    setExperiences(newExperiences);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {experiences.map((experience, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeExperience(index)}
            >
              Remove
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`title-${index}`}>Job Title</Label>
              <Input
                id={`title-${index}`}
                value={experience.title}
                onChange={(e) => updateExperience(index, 'title', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor={`company_name-${index}`}>Company Name</Label>
              <Input
                id={`company_name-${index}`}
                value={experience.company_name}
                onChange={(e) => updateExperience(index, 'company_name', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor={`joined_date-${index}`}>Joined Date</Label>
              <Input
                id={`joined_date-${index}`}
                type="date"
                value={experience.joined_date? experience.joined_date.split('T')[0] : ''}
                onChange={(e) => updateExperience(index, 'joined_date', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`currently_working-${index}`}
                checked={experience.currently_working}
                onCheckedChange={(checked) => 
                  updateExperience(index, 'currently_working', Boolean(checked))
                }
                disabled={isLoading}
              />
              <Label htmlFor={`currently_working-${index}`}>
                Currently Working Here
              </Label>
            </div>

            {!experience.currently_working && (
              <div>
                <Label htmlFor={`end_date-${index}`}>End Date</Label>
                <Input
                  id={`end_date-${index}`}
                  type="date"
                  value={experience.end_date? experience.end_date.split('T')[0] : ''}
                  onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={addExperience}
          disabled={isLoading}
        >
          Add Experience
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save All"}
        </Button>
      </div>
    </form>
  );
} 