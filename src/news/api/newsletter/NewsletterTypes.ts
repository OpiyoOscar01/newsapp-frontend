// src/api/newsletter/NewsletterTypes.ts

export interface NewsletterSubscriber {
  id: number;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribed_at: string;
  unsubscribed_at?: string;
  preferences?: {
    categories?: string[];
    frequency?: 'daily' | 'weekly' | 'monthly';
  };
}

export interface SubscribeRequest {
  email: string;
  name?: string;
  preferences?: {
    categories?: string[];
    frequency?: 'daily' | 'weekly' | 'monthly';
  };
}

export interface SubscribeResponse {
  success: boolean;
  message: string;
  data: {
    subscriber: NewsletterSubscriber;
  };
}

export interface UnsubscribeRequest {
  email: string;
}

export interface UnsubscribeResponse {
  success: boolean;
  message: string;
}

export interface GetPreferencesResponse {
  success: boolean;
  message: string;
  data: NewsletterSubscriber;
}

export interface UpdatePreferencesRequest {
  email: string;
  name?: string;
  preferences?: {
    categories?: string[];
    frequency?: 'daily' | 'weekly' | 'monthly';
  };
}

export interface UpdatePreferencesResponse {
  success: boolean;
  message: string;
  data: NewsletterSubscriber;
}