
export interface CompanyInfo {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  logo_url: string | null;
  banner_url: string | null;
  webhook_url: string | null;
  opening_hours: any;
  social_media: any;
}
