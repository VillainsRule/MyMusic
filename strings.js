import config from './config.js';

export default {
    cleared: ':broom: **Queue cleared!** Play your beats now :)',

    joinMissingVC: ':woozy_face: **You need to be in a VC.** How else do I know where to join?',
    joinError: `:woozy_face: **Please start a song with ${config.prefix}play.** ${config.prefix}join is for switching the song.`,
    joined: `:wave: **Switched to your VC!** Happy to see you :P`,

    noSongToLoop: `:woozy_face: **There is no song to loop.** ${config.prefix}play something first!`,
    loopEnabled: `:repeat_one: **Loop enabled.** Please don't use this to piss off the VC. :P`,
    loopDisabled: `:repeat: **Loop disabled.** You no longer need to hear the same stuff over and over :D`,

    missingSong: `:woozy_face: **How am I supposed to know what to play?** Example usage: ${config.prefix}play song title here :)`,
    playing: `:partying_face: **Now Playing:** {{SONG_TITLE}} ([link](<{{URL}}>))`,
    playMissingVC: `:woozy_face: **You need to be in a VC.** How else do I know where to play?`,
    addedtoQueue: `:partying_face: **Added to queue:** {{SONG_TITLE}} ([link](<{{URL}}>))`,
    loadingSong: `:thinking: Loading song...`,

    queueTitle: `## **:thinking: Song Queue**`,

    nothingToSkip: `:woozy_face: **There's nothing to skip.**`,
    skipped: `:disappointed_relieved: **Skipped that song.** I hope it wasn't too bad.`,

    nothingToStop: `:woozy_face: **There's nothing to stop.**`,
    stopped: `:disappointed_relieved: **Stopped the music.** I hope it wasn't too bad.`,

    volumeNothingPlaying: `:woozy_face: **There's nothing to change the volume of.**`,
    missingVolume: `:woozy_face: **How am I supposed to know what to change the volume to?** Example usage: ${config.prefix}volume 3`,
    volumeNaN: `:woozy_face: **You need to give me a real number.**`,
    volumeTooHigh: `:woozy_face: **Volume can't be above 10.** I refuse to ruin people's ears. :D`,
    volumeSet: `:partying_face: **Volume set to {{VOLUME}}.**`
};