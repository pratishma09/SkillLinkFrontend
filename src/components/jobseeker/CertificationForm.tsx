import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Certification } from "@/types/jobseeker";

interface CertificationFormProps {
  initialCertifications?: Certification[];
  onSave: (certifications: Certification[]) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function CertificationForm({ initialCertifications = [], onSave }: CertificationFormProps) {
  const [certifications, setCertifications] = useState<Certification[]>(
    initialCertifications.length > 0 ? initialCertifications : [{
      name: '',
      issuing_organization: '',
      issue_date: '',
      expiry_date: '',
      no_expiry: false,
      credential_id: '',
      credential_url: '',
    }]
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await Promise.all(certifications.map(async (cert) => {
        const url = cert.id 
          ? `${API_URL}/api/v1/jobseeker/certifications/${cert.id}`
          : `${API_URL}/api/v1/jobseeker/certifications`;
        
        const response = await fetch(url, {
          method: cert.id ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(cert)
        });

        if (!response.ok) {
          throw new Error('Failed to save certification');
        }
      }));

      toast({
        description: "Certifications updated successfully",
      });
      onSave(certifications);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update certifications",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        name: '',
        issuing_organization: '',
        issue_date: '',
        expiry_date: '',
        no_expiry: false,
        credential_id: '',
        credential_url: '',
      }
    ]);
  };

  const removeCertification = async (index: number) => {
    const certification = certifications[index];
    if (certification.id) {
      try {
        const response = await fetch(`${API_URL}/api/v1/jobseeker/certifications/${certification.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete certification');
        }
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to delete certification",
        });
        return;
      }
    }

    const newCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(newCertifications);
    onSave(newCertifications);
  };

  const updateCertification = (index: number, field: keyof Certification, value: any) => {
    const newCertifications = [...certifications];
    newCertifications[index] = {
      ...newCertifications[index],
      [field]: value
    };

    if (field === 'no_expiry' && value === true) {
      newCertifications[index].expiry_date = '';
    }

    setCertifications(newCertifications);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {certifications.map((certification, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeCertification(index)}
            >
              Remove
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`name-${index}`}>Certification Name</Label>
              <Input
                id={`name-${index}`}
                value={certification.name}
                onChange={(e) => updateCertification(index, 'name', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor={`issuing_organization-${index}`}>Issuing Organization</Label>
              <Input
                id={`issuing_organization-${index}`}
                value={certification.issuing_organization}
                onChange={(e) => updateCertification(index, 'issuing_organization', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor={`issue_date-${index}`}>Issue Date</Label>
              <Input
                id={`issue_date-${index}`}
                type="date"
                value={certification.issue_date ? certification.issue_date.split('T')[0] : ''}
                onChange={(e) => updateCertification(index, 'issue_date', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`no_expiry-${index}`}
                checked={certification.no_expiry}
                onCheckedChange={(checked) => 
                  updateCertification(index, 'no_expiry', Boolean(checked))
                }
                disabled={isLoading}
              />
              <Label htmlFor={`no_expiry-${index}`}>No Expiry</Label>
            </div>

            {!certification.no_expiry && (
              <div>
                <Label htmlFor={`expiry_date-${index}`}>Expiry Date</Label>
                <Input
                  id={`expiry_date-${index}`}
                  type="date"
                  value={certification.expiry_date ? certification.expiry_date.split('T')[0] : ''}
                  onChange={(e) => updateCertification(index, 'expiry_date', e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor={`credential_id-${index}`}>Credential ID</Label>
              <Input
                id={`credential_id-${index}`}
                value={certification.credential_id}
                onChange={(e) => updateCertification(index, 'credential_id', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor={`credential_url-${index}`}>Credential URL</Label>
              <Input
                id={`credential_url-${index}`}
                type="url"
                value={certification.credential_url}
                onChange={(e) => updateCertification(index, 'credential_url', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={addCertification}
          disabled={isLoading}
        >
          Add Certification
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save All"}
        </Button>
      </div>
    </form>
  );
} 