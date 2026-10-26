import { XtreamAuth, UserInfo, LiveChannel, Category, EpgProgramme, VodItem, SeriesData } from './types';

export class XtreamApiService {
  private static instance: XtreamApiService;
  private auth: XtreamAuth | null = null;

  private constructor() {}

  static getInstance(): XtreamApiService {
    if (!XtreamApiService.instance) {
      XtreamApiService.instance = new XtreamApiService();
    }
    return XtreamApiService.instance;
  }

  setAuth(auth: XtreamAuth) {
    this.auth = auth;
    localStorage.setItem('xtream_auth', JSON.stringify(auth));
  }

  getAuth(): XtreamAuth | null {
    if (this.auth) return this.auth;
    const saved = localStorage.getItem('xtream_auth');
    if (saved) {
      this.auth = JSON.parse(saved);
      return this.auth;
    }
    return null;
  }

  clearAuth() {
    this.auth = null;
    localStorage.removeItem('xtream_auth');
  }

  private buildUrl(endpoint: string, params: Record<string, any> = {}): string {
    if (!this.auth) throw new Error('Auth not set');
    
    const url = new URL(`${this.auth.serverUrl.replace(/\/$/, '')}/player_api.php`);
    url.searchParams.append('username', this.auth.username);
    url.searchParams.append('password', this.auth.password);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
    
    return url.toString();
  }

  private async fetch<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async getUserInfo(): Promise<UserInfo> {
    const data = await this.fetch<any>('player_api.php');
    return data.user_info;
  }

  async getLiveStreams(categoryId?: string): Promise<LiveChannel[]> {
    const params: Record<string, any> = { action: 'get_live_streams' };
    if (categoryId) params.category_id = categoryId;
    return await this.fetch<LiveChannel[]>('', params);
  }

  async getLiveCategories(): Promise<Category[]> {
    return await this.fetch<Category[]>('', { action: 'get_live_categories' });
  }

  async getShortEpg(channelIds: string[], limit = 10): Promise<Record<string, EpgProgramme[]>> {
    const result: Record<string, EpgProgramme[]> = {};
    
    for (const channelId of channelIds) {
      try {
        const data = await this.fetch<any>('', {
          action: 'get_short_epg',
          channel_id: channelId,
          limit: limit.toString()
        });
        result[channelId] = data.epg_list || [];
      } catch {
        result[channelId] = [];
      }
    }
    
    return result;
  }

  getStreamUrl(streamId: number): string {
    if (!this.auth) throw new Error('Auth not set');
    return `${this.auth.serverUrl.replace(/\/$/, '')}/live/${this.auth.username}/${this.auth.password}/${streamId}.m3u8`;
  }

  async getVodStreams(categoryId?: string): Promise<VodItem[]> {
    const params: Record<string, any> = { action: 'get_vod_streams' };
    if (categoryId) params.category_id = categoryId;
    return await this.fetch<VodItem[]>('', params);
  }

  async getVodCategories(): Promise<Category[]> {
    return await this.fetch<Category[]>('', { action: 'get_vod_categories' });
  }

  getVodUrl(streamId: number): string {
    if (!this.auth) throw new Error('Auth not set');
    return `${this.auth.serverUrl.replace(/\/$/, '')}/movie/${this.auth.username}/${this.auth.password}/${streamId}`;
  }

  async getSeries(): Promise<SeriesData[]> {
    return await this.fetch<SeriesData[]>('', { action: 'get_series' });
  }

  async getSeriesStreams(serieId: number, seasonNum: number, episodeNum: number): Promise<{ stream_id: number }> {
    const seriesData = await this.getSeries();
    const serie = seriesData.find(s => s.series_id === serieId);
    if (!serie || !serie.seasons) throw new Error('Serie non trovata');
    
    const season = seriesData[0].seasons[seasonNum.toString()];
    if (!season) throw new Error('Stagione non trovata');
    
    const episode = season.episodes.find(e => e.episode_number === episodeNum);
    if (!episode) throw new Error('Episodio non trovato');
    
    return { stream_id: episode.id };
  }

  getSeriesStreamUrl(serieId: number, seasonNum: number, streamId: number): string {
    if (!this.auth) throw new Error('Auth not set');
    return `${this.auth.serverUrl.replace(/\/$/, '')}/series/${this.auth.username}/${this.auth.password}/${streamId}/${seasonNum}.mp4`;
  }
}

export default XtreamApiService;
