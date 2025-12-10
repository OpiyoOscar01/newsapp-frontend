import { apiClient } from '../api/client';
import type { VisitorData, VisitorStats } from '../../utils/visitorTracking';

export interface TrackVisitorPayload {
  sessionId: string;
  uniqueVisitorId?: string;
  page: string;
  pageType: 'landing' | 'category' | 'article' | 'other';
  referrer?: string;
  referrerType: 'direct' | 'search' | 'social' | 'external' | 'internal';
  userAgent?: string;
  screenResolution?: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  location?: {
    country?: string;
    city?: string;
    timezone: string;
  };
  categorySlug?: string;
  articleId?: string;
  additionalData?: Record<string, any>;
}

export interface RealtimeVisitors {
  total_today: number;
  unique_today: number;
  active_now: number;
}

export interface ExportedData {
  raw_data: VisitorData[];
  stats: VisitorStats;
  exported_at: string;
  time_range: string;
  total_records: number;
}

export interface BatchTrackResult {
  success: number;
  failed: number;
  errors: Array<{ index: number; error: string }>;
}

class AnalyticsService {
  private readonly ENDPOINTS = {
    TRACK: '/analytics/visitors/track',
    STATS: '/analytics/visitors/stats',
    REALTIME: '/analytics/visitors/realtime',
    EXPORT: '/analytics/visitors/export',
    BATCH: '/analytics/visitors/batch',
  };

  /**
   * Track a visitor interaction
   * @param payload Visitor data to track
   * @returns Promise with tracked visitor data
   */
  async trackVisitor(payload: TrackVisitorPayload): Promise<VisitorData> {
    try {
      const response = await apiClient.postPublic<VisitorData>(
        this.ENDPOINTS.TRACK,
        payload
      );
      return response;
    } catch (error) {
      console.error('Failed to track visitor:', error);
      throw error;
    }
  }

  /**
   * Get visitor statistics
   * @param days Number of days to retrieve stats for (default: 7)
   * @returns Promise with visitor statistics
   */
  async getVisitorStats(days: number = 7): Promise<VisitorStats> {
    try {
      const response = await apiClient.getPublic<VisitorStats>(
        this.ENDPOINTS.STATS,
        { days }
      );
      return response;
    } catch (error) {
      console.error('Failed to get visitor stats:', error);
      throw error;
    }
  }

  /**
   * Get real-time visitor count
   * @returns Promise with real-time visitor data
   */
  async getRealtimeVisitors(): Promise<RealtimeVisitors> {
    try {
      const response = await apiClient.getPublic<RealtimeVisitors>(
        this.ENDPOINTS.REALTIME
      );
      return response;
    } catch (error) {
      console.error('Failed to get realtime visitors:', error);
      throw error;
    }
  }

  /**
   * Export visitor data
   * @param days Number of days to export (default: 30)
   * @returns Promise with exported data
   */
  async exportVisitorData(days: number = 30): Promise<ExportedData> {
    try {
      const response = await apiClient.getPublic<ExportedData>(
        this.ENDPOINTS.EXPORT,
        { days }
      );
      return response;
    } catch (error) {
      console.error('Failed to export visitor data:', error);
      throw error;
    }
  }

  /**
   * Batch track multiple visitor events (for syncing local storage to backend)
   * @param visitors Array of visitor data to track
   * @returns Promise with results of tracking operations
   */
  async batchTrackVisitors(visitors: TrackVisitorPayload[]): Promise<BatchTrackResult> {
    if (visitors.length === 0) {
      return { success: 0, failed: 0, errors: [] };
    }

    // Try to use batch endpoint if available
    try {
      const response = await apiClient.postPublic<BatchTrackResult>(
        this.ENDPOINTS.BATCH,
        { visitors }
      );
      return response;
    } catch (batchError) {
      console.warn('Batch endpoint failed, falling back to individual tracking:', batchError);
      
      // Fallback to individual tracking
      const results: BatchTrackResult = {
        success: 0,
        failed: 0,
        errors: [],
      };

      // Track visitors in batches of 10 to avoid overwhelming the server
      const batchSize = 10;
      for (let i = 0; i < visitors.length; i += batchSize) {
        const batch = visitors.slice(i, i + batchSize);
        const promises = batch.map((visitor, batchIndex) =>
          this.trackVisitor(visitor)
            .then(() => {
              results.success++;
            })
            .catch((error) => {
              results.failed++;
              results.errors.push({
                index: i + batchIndex,
                error: error instanceof Error ? error.message : 'Unknown error',
              });
            })
        );

        await Promise.allSettled(promises);
        
        // Add a small delay between batches to avoid rate limiting
        if (i + batchSize < visitors.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      return results;
    }
  }
}

export const analyticsService = new AnalyticsService();