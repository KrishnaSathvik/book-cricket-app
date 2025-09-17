// Cricket Sound Manager - Adds cricket vibes to the game!

class SoundManager {
  constructor() {
    this.sounds = {};
    this.isEnabled = true;
    this.volume = 0.7;
    this.audioContext = null;
    this.isInitialized = false;
    this.initSounds();
  }

  initAudioContext() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.isInitialized = true;
      } catch (error) {
        console.log('Audio not supported:', error);
        this.isEnabled = false;
      }
    }
    return this.audioContext;
  }

  initSounds() {
    // Create audio contexts for different sound effects
    this.sounds = {
      // Bat hitting ball sounds
      single: this.createTone(200, 0.1, 'sine'), // Low thud
      double: this.createTone(300, 0.15, 'sine'), // Medium thud
      triple: this.createTone(400, 0.2, 'sine'), // Higher thud
      four: this.createTone(500, 0.3, 'square'), // Sharp crack
      five: this.createTone(600, 0.4, 'square'), // Strong crack
      six: this.createTone(800, 0.5, 'square'), // Powerful crack
      
      // Out sounds
      out: this.createTone(150, 0.8, 'sawtooth'), // Low thud for wicket
      
      // Dot ball
      dot: this.createTone(100, 0.05, 'triangle'), // Soft tap
      
      // Crowd reactions
      crowdCheer: this.createCrowdSound(),
      crowdApplaud: this.createApplauseSound(),
      
      // Background ambience
      background: this.createBackgroundAmbience(),
      
      // Page turn sound
      pageTurn: this.createTone(1200, 0.1, 'triangle'), // Page flip
      
      // Game events
      gameStart: this.createTone(440, 0.5, 'sine'), // Starting bell
      gameOver: this.createTone(220, 1, 'sawtooth'), // Ending sound
    };
  }

  createTone(frequency, duration, waveType = 'sine') {
    return () => {
      if (!this.isEnabled) return;
      
      const audioContext = this.initAudioContext();
      if (!audioContext) return;
      
      try {
        // Resume audio context if suspended (required by some browsers)
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = waveType;
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      } catch (error) {
        console.log('Audio playback error:', error);
      }
    };
  }

  createCrowdSound() {
    return () => {
      if (!this.isEnabled) return;
      
      const audioContext = this.initAudioContext();
      if (!audioContext) return;
      
      // Create multiple tones to simulate crowd
      const frequencies = [200, 250, 300, 350, 400];
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          this.createTone(freq, 0.5, 'sine')();
        }, index * 50);
      });
    };
  }

  createApplauseSound() {
    return () => {
      if (!this.isEnabled) return;
      
      const audioContext = this.initAudioContext();
      if (!audioContext) return;
      
      // Create applause-like sound
      const frequencies = [400, 500, 600, 700, 800];
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          this.createTone(freq, 0.3, 'square')();
        }, index * 30);
      });
    };
  }

  createBackgroundAmbience() {
    return () => {
      if (!this.isEnabled) return;
      
      const audioContext = this.initAudioContext();
      if (!audioContext) return;
      
      // Subtle background cricket ground ambience
      this.createTone(60, 2, 'sine')(); // Very low rumble
    };
  }

  // Play sound for different game events
  playRunSound(runs) {
    if (runs === 0) {
      this.sounds.dot();
    } else if (runs === 1) {
      this.sounds.single();
    } else if (runs === 2) {
      this.sounds.double();
    } else if (runs === 3) {
      this.sounds.triple();
    } else if (runs === 4) {
      this.sounds.four();
      setTimeout(() => this.sounds.crowdCheer(), 200);
    } else if (runs === 5) {
      this.sounds.five();
      setTimeout(() => this.sounds.crowdCheer(), 200);
    } else if (runs === 6) {
      this.sounds.six();
      setTimeout(() => this.sounds.crowdApplaud(), 300);
    }
  }

  playOutSound() {
    this.sounds.out();
    setTimeout(() => this.sounds.crowdApplaud(), 500);
  }

  playPageTurnSound() {
    this.sounds.pageTurn();
  }

  playGameStartSound() {
    this.sounds.gameStart();
  }

  playGameOverSound() {
    this.sounds.gameOver();
  }

  playBackgroundAmbience() {
    this.sounds.background();
  }

  // Control methods
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  toggleSound() {
    this.isEnabled = !this.isEnabled;
    if (this.isEnabled && !this.isInitialized) {
      // Initialize audio context on first user interaction
      this.initAudioContext();
    }
    return this.isEnabled;
  }

  enableSound() {
    this.isEnabled = true;
    if (!this.isInitialized) {
      this.initAudioContext();
    }
  }

  disableSound() {
    this.isEnabled = false;
  }

  // Initialize audio on first user interaction
  initializeOnUserInteraction() {
    if (!this.isInitialized) {
      this.initAudioContext();
    }
  }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;
