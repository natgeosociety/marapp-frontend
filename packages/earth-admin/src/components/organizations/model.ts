export interface Organization {
    id: string;
    name: string;
    description: string;
  }
  
  export interface OrganizationProps {
    data: Organization;
  }
  
  export interface OrganizationEditProps {
    data: Organization;
    newOrg: boolean;
  }
  