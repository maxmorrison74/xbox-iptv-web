export interface XtreamAuth {
  serverUrl: string;
  username: string;
  password: string;
}

export interface UserInfo {
  username: string;
  password: string;
  status: string;
  exp_date: string;
  license_plate: string;
}

export interface LiveChannel {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  epg_channel_id?: string;
  category_id: string;
}

export interface Category {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface EpgProgramme {
  channel_id: string;
  title: string;
  description: string;
  start: string;
  stop: string;
  icon?: string;
}

export interface VodItem {
  num: number;
  name: string;
  stream_id: number;
  stream_icon: string;
  rating: string;
  category_id: string;
  info: {
    plot?: string;
    duration?: string;
  };
}

export interface SeriesData {
  name: string;
  series_id: number;
  cover: string;
  seasons: {
    [key: string]: {
      title: string;
      episodes: Episode[];
      season_number: number;
    };
  };
}

export interface Episode {
  id: number;
  name: string;
  season_number: number;
  episode_number: number;
  info: {
    plot?: string;
  };
}
