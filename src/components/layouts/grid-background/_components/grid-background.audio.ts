import {
  CLICK_SOUND,
  CLICK_TICK_COOLDOWN,
  HOVER_TICK_COOLDOWN,
  SOUND_ENABLED,
  TACTILE_HOVER_SOUNDS,
  type ToneConfig,
} from "./grid-background.constants";

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/**
 * Web Audio engine for the grid background's tactile cursor feedback.
 * Owns its own AudioContext and cooldown state; lazily resumes on first use.
 * `hasFinePointer` is a getter so the engine reads the latest pointer state.
 */
export function createGridAudio(hasFinePointer: () => boolean) {
  let audioContext: AudioContext | null = null;
  let lastTickAt = 0;
  let lastClickAt = 0;

  function getAudioContext() {
    audioContext ??= new AudioContext();
    return audioContext;
  }

  function playTone({
    type,
    startFrequency,
    endFrequency,
    frequency,
    volume,
    delay = 0,
    duration,
  }: ToneConfig) {
    if (!SOUND_ENABLED) return;

    try {
      const audio = getAudioContext();

      if (audio.state === "suspended") {
        void audio.resume();
      }

      const osc = audio.createOscillator();
      const gain = audio.createGain();

      const start = audio.currentTime + delay;
      const end = start + duration;

      osc.type = type;

      if (typeof frequency === "number") {
        osc.frequency.setValueAtTime(frequency, start);
      } else {
        osc.frequency.setValueAtTime(startFrequency ?? 500, start);
        osc.frequency.exponentialRampToValueAtTime(
          endFrequency ?? 300,
          start + duration * 0.7,
        );
      }

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);

      osc.connect(gain);
      gain.connect(audio.destination);

      osc.start(start);
      osc.stop(end);
    } catch {
      // Browser blocked audio.
    }
  }

  function playTactileHover() {
    const preset =
      TACTILE_HOVER_SOUNDS[
        Math.floor(Math.random() * TACTILE_HOVER_SOUNDS.length)
      ];

    const pitchShift = randomBetween(0.94, 1.08);
    const volumeShift = randomBetween(0.85, 1);
    const durationShift = randomBetween(-0.004, 0.004);

    playTone({
      ...preset,
      startFrequency: preset.startFrequency * pitchShift,
      endFrequency: preset.endFrequency * pitchShift,
      volume: preset.volume * volumeShift,
      duration: preset.duration + durationShift,
    });
  }

  function playTactileTick() {
    if (!hasFinePointer()) return;

    const now = performance.now();

    if (now - lastTickAt < HOVER_TICK_COOLDOWN) return;

    lastTickAt = now;

    playTactileHover();
  }

  function playTactileClick() {
    const now = performance.now();

    if (now - lastClickAt < CLICK_TICK_COOLDOWN) return;

    lastClickAt = now;

    playTone(CLICK_SOUND);
  }

  function close() {
    void audioContext?.close();
  }

  return { playTactileTick, playTactileClick, close };
}
