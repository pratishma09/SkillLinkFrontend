import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Education } from "@/types/jobseeker";

interface EducationFormProps {
  initialEducation?: Education[];
  onSave: (education: Education[]) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function EducationForm({ initialEducation = [], onSave }: EducationFormProps) {
  const [educations, setEducations] = useState<Education[]>(
    initialEducation.length > 0 ? initialEducation : [{
      institution: '',
      board: '',
      graduation_year: '',
      gpa: '',
    }]
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save all education records
      await Promise.all(educations.map(async (edu) => {
        const url = edu.id 
          ? `${API_URL}/api/v1/jobseeker/education/${edu.id}`
          : `${API_URL}/api/v1/jobseeker/education`;
        
        const response = await fetch(url, {
          method: edu.id ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(edu)
        });

        if (!response.ok) {
          throw new Error('Failed to save education');
        }
      }));

      toast({
        description: "Education updated successfully",
      });
      onSave(educations);
    } catch (error) {
      console.log(educations);
      toast({
        variant: "destructive",
        description: "Failed to update education",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        institution: '',
        board: '',
        graduation_year: '',
        gpa: '',
      }
    ]);
  };

  const removeEducation = async (index: number) => {
    const education = educations[index];
    if (education.id) {
      try {
        const response = await fetch(`${API_URL}/api/v1/jobseeker/education/${education.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type':'application/json',
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete education');
        }
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to delete education",
        });
        return;
      }
    }

    const newEducations = educations.filter((_, i) => i !== index);
    setEducations(newEducations);
    onSave(newEducations);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newEducations = [...educations];
    newEducations[index] = { 
      ...newEducations[index], 
      [field]: value 
    };
    setEducations(newEducations);
  };

  const currentYear = new Date().getFullYear();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {educations.map((education, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeEducation(index)}
            >
              Remove
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`institution-${index}`}>Institution</Label>
              <Input
                id={`institution-${index}`}
                value={education.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor={`board-${index}`}>Board</Label>
              <Input
                id={`board-${index}`}
                value={education.board}
                onChange={(e) => updateEducation(index, 'board', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor={`graduation_year-${index}`}>Graduation Year</Label>
              <Input
                id={`graduation_year-${index}`}
                type="number"
                min="1900"
                max={currentYear + 10}
                value={education.graduation_year}
                onChange={(e) => updateEducation(index, 'graduation_year', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor={`gpa-${index}`}>GPA</Label>
              <Input
                id={`gpa-${index}`}
                value={education.gpa}
                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={addEducation}
          disabled={isLoading}
        >
          Add Education
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save All"}
        </Button>
      </div>
    </form>
  );
} 