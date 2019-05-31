// importing dependencies
import { AsyncStorage } from 'react-native';


import config from './config';



export const fetchTopMovie = async () => {
    const topMovieUrl = config.rootUrl + '/api/featured-movies/1';
    const topMovieJson = await fetch(topMovieUrl, {
        method: 'GET',
        headers: {
            appId: config.appId,
            appKey: config.appKey
        }
    })
    return topMovieResponse = await topMovieJson.json();
}

export const fetchFeaturedMovie = async () => {
    const featuredMoviesUrl = config.rootUrl + '/api/featured-movies/' + config.limit;
    const featuredMoviesJson = await fetch(featuredMoviesUrl, {
        method: 'GET',
        headers: {
            appId: config.appId,
            appKey: config.appKey
        }
    })
    return featuredMoviesResponse = await featuredMoviesJson.json();
}

export const fetchtrendingMovies = async () => {
    const popularMoviesUrl = config.rootUrl + '/api/trending-movies/' + config.limit;
    const popularMoviesJson = await fetch(popularMoviesUrl, {
        method: 'GET',
        headers: {
            appId: config.appId,
            appKey: config.appKey
        }
    })
    return popularMoviesResponse = await popularMoviesJson.json();
}

export const fetchRecentMovies = async () => {
    const recentMoviesUrl = config.rootUrl + '/api/recent-movies/' + config.offSet;
    const recentMoviesJson = await fetch(recentMoviesUrl, {
        method: 'GET',
        headers: {
            appId: config.appId,
            appKey: config.appKey
        }
    })
    return recentMoviesResponse = await recentMoviesJson.json();
}

export const fetchBongoMovies = async () => {
    bongoMoviesUrl = config.rootUrl + '/api/movies-by-condition/' + config.offSet + '?type=category&id=5';
    const bongoMovies = await fetch(bongoMoviesUrl, {
        method: 'GET',
        headers: {
            appId: config.appId,
            appKey: config.appKey
        }
    });
    return bongoMoviesResponse = await bongoMovies.json();
}

export const fetchSeries = async () => {
    const seriesUrl = config.rootUrl + '/api/series/' + config.offSet;
    const seriesJson = await fetch(seriesUrl, {
        method: 'GET',
        headers: {
            appId: config.appId,
            appKey: config.appKey
        }
    })
    return seriesResponse = await seriesJson.json();
}

export const fetchMovies = async () => {
    const moviesUrl = config.rootUrl + '/api/movies/' + config.offSet;
    const moviesJson = await fetch(moviesUrl, {
        method: 'GET',
        headers: {
            appId: config.appId,
            appKey: config.appKey
        }
    })
    return moviesResponse = await moviesJson.json();
}

export const fetchShortMovies = async () => {
    const shortMoviesUrl = config.rootUrl + '/api/short-movies/' + config.offSet;
    const shortMoviesJson = await fetch(shortMoviesUrl, {
        method: 'GET',
        headers: {
            appId: config.appId,
            appKey: config.appKey
        }
    })
    return shortMoviesResponse = await shortMoviesJson.json();
}


// a function to refresh token
export const refreshToken = async () => {
    const value = await AsyncStorage.getItem('logginKey');
    const bearer = 'Bearer ' + value;
    try {
        const newToken = await fetch(config.rootUrl + '/api/refresh-token', {
            method: 'GET',
            headers: {
                appId: config.appId,
                appKey: config.appKey,
                Authorization: bearer,
            }
        });
        const newTokenResponse = await newToken.json();
        AsyncStorage.setItem('logginKey', newTokenResponse.token);
        return refreshed = 'done';
    } catch (e) {
        return refreshed = 'error';
    }
}



// a function to get the video link provided by vimeo
export const getVimeoId = async (videoId) => {
    token = await AsyncStorage.getItem('logginKey');
    var bearer = 'Bearer ' + token;
    const dataJson = await fetch(config.rootUrl + '/api/get-vimeo-id', {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
            appId: config.appId,
            appKey: config.appKey,
            Authorization: bearer,
            accept: 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            id: videoId
        })
    })
    var dataResponse = await dataJson.json();
    return dataResponse;
}