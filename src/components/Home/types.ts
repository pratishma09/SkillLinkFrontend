export interface Internship {
  id: number;
  title: string;
  company: Company;
  projectcategory:{
    id: any;
    name:string
  }
  location: string;
  type_of_project: string;
  status:string;
  category: string;
  description: string;
  salary: string;
  deadline: string;
}

export interface Company {
  id: number;
  logo:string;
  description:string;
  website:string;
  phone:string;
  address:string;
  name:string;
  user:{
    name:string
  }
} 

export interface College {
  id: number;
  logo:string;
  description:string;
  website:string;
  phone:string;
  address:string;
  name:string;
  user:{
    name:string
  }
} 