<template>
  <div></div>
</template>

<script>
import { methods } from 'vue';

// Utilities
import hashURL from '@/components/Utils/hashURL';

export default {
  name: 'Player',
  setup() {
    /* eslint-disable no-console */
    /* eslint-disable padded-blocks */
    /* eslint-disable no-trailing-spaces */
    /* eslint-disable no-multiple-empty-lines */
    /* eslint-disable semi */
    /* eslint-disable indent */
    /* eslint-disable no-unused-vars */
    /* eslint-disable max-len */
    /* eslint-disable no-param-reassign */

    methods(() => {
      async function waitForSpotifyWebPlaybackSDKToLoad() {
        return new Promise((resolve) => {
          if (window.Spotify) {
            resolve(window.Spotify);
          } else {
            window.onSpotifyWebPlaybackSDKReady = () => {
              resolve(window.Spotify);
            };
          }
        });
      }

      async function initialisePlayer() {
        const { Player } = await waitForSpotifyWebPlaybackSDKToLoad();
        const player = new Player({
          name: 'Web Playback SDK Template',
          getOAuthToken: (cb) => { cb(TOKEN); },
        });

        // Error handling
        player.on('initialization_error', (e) => console.error(e));
        player.on('authentication_error', (e) => console.error(e));
        player.on('account_error', (e) => console.error(e));
        player.on('playback_error', (e) => console.error(e));

        // Playback status updates
        // player.on('player_state_changed', state => {
        //   console.log(state)
        //   $('#current-track').attr('src', state.track_window.current_track.album.images[0].url);
        //   $('#current-track-name').text(state.track_window.current_track.name);
        // });

        // Ready
        player.on('ready', (data) => {
          console.log('Ready with Device ID', data.device_id);

          // getEmotion(data.device_id);
        });

        // Connect to the player!
        player.connect();
      }
      // window.onSpotifyPlayerAPIReady = () => {

      // });
    });
  },
};
</script>
