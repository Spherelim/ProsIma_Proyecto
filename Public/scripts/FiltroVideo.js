class VideoFilterSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.videoElement = null;
        this.animationFrame = null;
        this.currentFilter = 'default';
        this.isActive = false;
        this.time = 0;
        
        // Parámetros ajustables para cada filtro
        this.params = {
            shockwave: { intensity: 0.5, speed: 1.0, size: 1.0 },
            kaleidoscope: { segments: 6, rotation: 0, scale: 1.0 },
            pixelGlitch: { pixelSize: 8, glitchAmount: 0.5, bandHeight: 15 },
            waveDistortion: { amplitudeX: 20, amplitudeY: 15, frequency: 0.05, speed: 1.5 },
            blackHole: { strength: 0.8, twist: 2.0, size: 1.0 },
            pixelSorting: { threshold: 0.3, lineHeight: 10 },
            liquidRipple: { amplitude: 15, frequency: 0.08, speed: 4, decay: 1.0 },
            chromaticAberration: { intensity: 15, angle: 0.5, waveEffect: 0.02 },
            mirror: { orientation: 'vertical', offset: 0, blend: 0.8 },
            colorTones: { red: 1.0, green: 1.0, blue: 1.0, saturation: 1.0, brightness: 1.0, contrast: 1.0 }
        };
        
        // Configuración de filtros CORREGIDA
        this.filters = {
            default: (frameData, width, height) => frameData,
            
            shockwave: (frameData, width, height) => {
                const output = new Uint8ClampedArray(frameData.length);
                const centerX = width / 2;
                const centerY = height / 2;
                const maxRadius = Math.min(width, height) / 2 * this.params.shockwave.size;
                const intensity = this.params.shockwave.intensity * 80;
                
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const dx = x - centerX;
                        const dy = y - centerY;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const ratio = distance / maxRadius;
                        
                        if (ratio < 1) {
                            const distortion = Math.sin(ratio * Math.PI) * intensity;
                            const angle = Math.atan2(dy, dx);
                            const newDistance = Math.max(0, distance + distortion);
                            
                            const srcX = centerX + Math.cos(angle) * newDistance;
                            const srcY = centerY + Math.sin(angle) * newDistance;
                            
                            if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
                                const srcIdx = (Math.floor(srcY) * width + Math.floor(srcX)) * 4;
                                const dstIdx = (y * width + x) * 4;
                                output[dstIdx] = frameData[srcIdx];
                                output[dstIdx + 1] = frameData[srcIdx + 1];
                                output[dstIdx + 2] = frameData[srcIdx + 2];
                                output[dstIdx + 3] = frameData[srcIdx + 3];
                                continue;
                            }
                        }
                        const dstIdx = (y * width + x) * 4;
                        output[dstIdx] = frameData[dstIdx];
                        output[dstIdx + 1] = frameData[dstIdx + 1];
                        output[dstIdx + 2] = frameData[dstIdx + 2];
                        output[dstIdx + 3] = frameData[dstIdx + 3];
                    }
                }
                return this.applyColorAdjustments(output);
            },
            
            kaleidoscope: (frameData, width, height) => {
                const output = new Uint8ClampedArray(frameData.length);
                const segments = Math.max(3, Math.floor(this.params.kaleidoscope.segments));
                const rotation = this.params.kaleidoscope.rotation;
                const scale = this.params.kaleidoscope.scale;
                const centerX = width / 2;
                const centerY = height / 2;
                
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        let dx = (x - centerX) / (centerX * scale);
                        let dy = (y - centerY) / (centerY * scale);
                        let radius = Math.sqrt(dx * dx + dy * dy);
                        let angle = Math.atan2(dy, dx) + rotation;
                        
                        if (radius > 0) {
                            const segmentAngle = (Math.PI * 2) / segments;
                            let newAngle = angle % segmentAngle;
                            if (newAngle < 0) newAngle += segmentAngle;
                            
                            const reflect = Math.floor(angle / segmentAngle) % 2 === 1;
                            if (reflect) newAngle = segmentAngle - newAngle;
                            
                            const srcX = centerX + Math.cos(newAngle) * radius * centerX;
                            const srcY = centerY + Math.sin(newAngle) * radius * centerY;
                            
                            if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
                                const srcIdx = (Math.floor(srcY) * width + Math.floor(srcX)) * 4;
                                const dstIdx = (y * width + x) * 4;
                                output[dstIdx] = frameData[srcIdx];
                                output[dstIdx + 1] = frameData[srcIdx + 1];
                                output[dstIdx + 2] = frameData[srcIdx + 2];
                                output[dstIdx + 3] = frameData[srcIdx + 3];
                                continue;
                            }
                        }
                        const dstIdx = (y * width + x) * 4;
                        output[dstIdx] = frameData[dstIdx];
                        output[dstIdx + 1] = frameData[dstIdx + 1];
                        output[dstIdx + 2] = frameData[dstIdx + 2];
                        output[dstIdx + 3] = frameData[dstIdx + 3];
                    }
                }
                return this.applyColorAdjustments(output);
            },
            
            pixelGlitch: (frameData, width, height) => {
                const output = new Uint8ClampedArray(frameData);
                const pixelSize = Math.max(2, Math.floor(this.params.pixelGlitch.pixelSize));
                const glitchAmount = this.params.pixelGlitch.glitchAmount;
                
                for (let y = 0; y < height; y += pixelSize) {
                    for (let x = 0; x < width; x += pixelSize) {
                        if (Math.random() < glitchAmount) {
                            const offsetX = (Math.random() - 0.5) * pixelSize * 2;
                            const offsetY = (Math.random() - 0.5) * pixelSize;
                            
                            const srcX = Math.min(Math.max(x + offsetX, 0), width - pixelSize);
                            const srcY = Math.min(Math.max(y + offsetY, 0), height - pixelSize);
                            const srcIdx = (Math.floor(srcY) * width + Math.floor(srcX)) * 4;
                            
                            for (let py = 0; py < pixelSize; py++) {
                                for (let px = 0; px < pixelSize; px++) {
                                    const dstX = Math.min(x + px, width - 1);
                                    const dstY = Math.min(y + py, height - 1);
                                    const dstIdx = (dstY * width + dstX) * 4;
                                    output[dstIdx] = frameData[srcIdx];
                                    output[dstIdx + 1] = frameData[srcIdx + 1];
                                    output[dstIdx + 2] = frameData[srcIdx + 2];
                                }
                            }
                        }
                    }
                }
                return this.applyColorAdjustments(output);
            },
            
            waveDistortion: (frameData, width, height) => {
                const output = new Uint8ClampedArray(frameData.length);
                const ampX = this.params.waveDistortion.amplitudeX;
                const ampY = this.params.waveDistortion.amplitudeY;
                const freq = this.params.waveDistortion.frequency;
                const speed = this.params.waveDistortion.speed;
                
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const offsetX = Math.sin(y * freq + this.time * speed) * ampX;
                        const offsetY = Math.cos(x * freq + this.time * speed * 1.2) * ampY;
                        
                        let srcX = x + offsetX;
                        let srcY = y + offsetY;
                        
                        if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
                            const srcIdx = (Math.floor(srcY) * width + Math.floor(srcX)) * 4;
                            const dstIdx = (y * width + x) * 4;
                            output[dstIdx] = frameData[srcIdx];
                            output[dstIdx + 1] = frameData[srcIdx + 1];
                            output[dstIdx + 2] = frameData[srcIdx + 2];
                            output[dstIdx + 3] = frameData[srcIdx + 3];
                        } else {
                            const dstIdx = (y * width + x) * 4;
                            output[dstIdx] = frameData[dstIdx];
                            output[dstIdx + 1] = frameData[dstIdx + 1];
                            output[dstIdx + 2] = frameData[dstIdx + 2];
                            output[dstIdx + 3] = frameData[dstIdx + 3];
                        }
                    }
                }
                return this.applyColorAdjustments(output);
            },
            
            blackHole: (frameData, width, height) => {
                const output = new Uint8ClampedArray(frameData.length);
                const centerX = width / 2;
                const centerY = height / 2;
                const maxRadius = Math.min(width, height) / 2 * this.params.blackHole.size;
                const strength = this.params.blackHole.strength;
                const twist = this.params.blackHole.twist;
                
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const dx = x - centerX;
                        const dy = y - centerY;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < maxRadius) {
                            const ratio = distance / maxRadius;
                            const angle = Math.atan2(dy, dx);
                            const newAngle = angle + (1 - ratio) * Math.PI * twist;
                            const newDistance = distance * Math.pow(ratio, strength);
                            
                            const srcX = centerX + Math.cos(newAngle) * newDistance;
                            const srcY = centerY + Math.sin(newAngle) * newDistance;
                            
                            if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
                                const srcIdx = (Math.floor(srcY) * width + Math.floor(srcX)) * 4;
                                const dstIdx = (y * width + x) * 4;
                                output[dstIdx] = frameData[srcIdx];
                                output[dstIdx + 1] = frameData[srcIdx + 1];
                                output[dstIdx + 2] = frameData[srcIdx + 2];
                                output[dstIdx + 3] = frameData[srcIdx + 3];
                                continue;
                            }
                        }
                        const dstIdx = (y * width + x) * 4;
                        output[dstIdx] = frameData[dstIdx];
                        output[dstIdx + 1] = frameData[dstIdx + 1];
                        output[dstIdx + 2] = frameData[dstIdx + 2];
                        output[dstIdx + 3] = frameData[dstIdx + 3];
                    }
                }
                return this.applyColorAdjustments(output);
            },
            
            pixelSorting: (frameData, width, height) => {
                const output = new Uint8ClampedArray(frameData);
                const threshold = this.params.pixelSorting.threshold;
                const lineHeight = Math.max(3, Math.floor(this.params.pixelSorting.lineHeight));
                
                for (let y = 0; y < height; y += lineHeight) {
                    if (Math.random() > threshold) continue;
                    
                    const startX = Math.floor(Math.random() * width * 0.2);
                    const endX = startX + Math.floor(Math.random() * width * 0.3);
                    
                    if (endX > startX && endX < width) {
                        const pixels = [];
                        for (let x = startX; x < endX; x++) {
                            const idx = (y * width + x) * 4;
                            const brightness = (frameData[idx] + frameData[idx + 1] + frameData[idx + 2]) / 3;
                            pixels.push({
                                r: frameData[idx],
                                g: frameData[idx + 1],
                                b: frameData[idx + 2],
                                brightness: brightness
                            });
                        }
                        pixels.sort((a, b) => a.brightness - b.brightness);
                        for (let x = startX; x < endX; x++) {
                            const idx = (y * width + x) * 4;
                            const p = pixels[x - startX];
                            output[idx] = p.r;
                            output[idx + 1] = p.g;
                            output[idx + 2] = p.b;
                        }
                    }
                }
                return this.applyColorAdjustments(output);
            },
            
            liquidRipple: (frameData, width, height) => {
                const output = new Uint8ClampedArray(frameData.length);
                const amplitude = this.params.liquidRipple.amplitude;
                const frequency = this.params.liquidRipple.frequency;
                const speed = this.params.liquidRipple.speed;
                const decay = this.params.liquidRipple.decay;
                const centerX = width / 2;
                const centerY = height / 2;
                
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const dx = x - centerX;
                        const dy = y - centerY;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const ripple = Math.sin(distance * frequency - this.time * speed) * amplitude * Math.exp(-distance * decay / 100);
                        const angle = Math.atan2(dy, dx);
                        
                        const srcX = x + Math.cos(angle) * ripple;
                        const srcY = y + Math.sin(angle) * ripple;
                        
                        if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
                            const srcIdx = (Math.floor(srcY) * width + Math.floor(srcX)) * 4;
                            const dstIdx = (y * width + x) * 4;
                            output[dstIdx] = frameData[srcIdx];
                            output[dstIdx + 1] = frameData[srcIdx + 1];
                            output[dstIdx + 2] = frameData[srcIdx + 2];
                            output[dstIdx + 3] = frameData[srcIdx + 3];
                        } else {
                            const dstIdx = (y * width + x) * 4;
                            output[dstIdx] = frameData[dstIdx];
                            output[dstIdx + 1] = frameData[dstIdx + 1];
                            output[dstIdx + 2] = frameData[dstIdx + 2];
                            output[dstIdx + 3] = frameData[dstIdx + 3];
                        }
                    }
                }
                return this.applyColorAdjustments(output);
            },
            
            chromaticAberration: (frameData, width, height) => {
                const output = new Uint8ClampedArray(frameData.length);
                const intensity = this.params.chromaticAberration.intensity;
                const angle = this.params.chromaticAberration.angle;
                const waveEffect = this.params.chromaticAberration.waveEffect;
                
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const waveX = Math.sin(y * waveEffect) * intensity * 0.2;
                        const waveY = Math.cos(x * waveEffect) * intensity * 0.2;
                        const offsetX = Math.cos(angle) * intensity + waveX;
                        const offsetY = Math.sin(angle) * intensity + waveY;
                        
                        const srcXR = Math.min(Math.max(x + offsetX, 0), width - 1);
                        const srcXG = Math.min(Math.max(x, 0), width - 1);
                        const srcXB = Math.min(Math.max(x - offsetX, 0), width - 1);
                        const srcY = Math.min(Math.max(y + offsetY, 0), height - 1);
                        
                        const idxR = (Math.floor(srcY) * width + Math.floor(srcXR)) * 4;
                        const idxG = (Math.floor(srcY) * width + Math.floor(srcXG)) * 4;
                        const idxB = (Math.floor(srcY) * width + Math.floor(srcXB)) * 4;
                        const dstIdx = (y * width + x) * 4;
                        
                        output[dstIdx] = frameData[idxR];
                        output[dstIdx + 1] = frameData[idxG + 1];
                        output[dstIdx + 2] = frameData[idxB + 2];
                        output[dstIdx + 3] = frameData[dstIdx + 3];
                    }
                }
                return this.applyColorAdjustments(output);
            },
            
            mirror: (frameData, width, height) => {
                const output = new Uint8ClampedArray(frameData.length);
                const orientation = this.params.mirror.orientation;
                const offset = this.params.mirror.offset;
                const blend = this.params.mirror.blend;
                
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        let srcX = x;
                        let srcY = y;
                        
                        if (orientation === 'vertical') {
                            const center = width / 2 + offset;
                            if (x > center) {
                                srcX = Math.max(0, Math.min(width - 1, center - (x - center)));
                            }
                        } else {
                            const center = height / 2 + offset;
                            if (y > center) {
                                srcY = Math.max(0, Math.min(height - 1, center - (y - center)));
                            }
                        }
                        
                        const srcIdx = (Math.floor(srcY) * width + Math.floor(srcX)) * 4;
                        const dstIdx = (y * width + x) * 4;
                        
                        if (blend < 1 && ((orientation === 'vertical' && x > width/2) || (orientation === 'horizontal' && y > height/2))) {
                            output[dstIdx] = frameData[dstIdx] * (1 - blend) + frameData[srcIdx] * blend;
                            output[dstIdx + 1] = frameData[dstIdx + 1] * (1 - blend) + frameData[srcIdx + 1] * blend;
                            output[dstIdx + 2] = frameData[dstIdx + 2] * (1 - blend) + frameData[srcIdx + 2] * blend;
                        } else {
                            output[dstIdx] = frameData[srcIdx];
                            output[dstIdx + 1] = frameData[srcIdx + 1];
                            output[dstIdx + 2] = frameData[srcIdx + 2];
                        }
                        output[dstIdx + 3] = frameData[dstIdx + 3];
                    }
                }
                return this.applyColorAdjustments(output);
            },
            
            colorTones: (frameData, width, height) => {
                return this.applyColorAdjustments(new Uint8ClampedArray(frameData));
            }
        };
    }
    
    applyColorAdjustments(frameData) {
        const params = this.params.colorTones;
        for (let i = 0; i < frameData.length; i += 4) {
            let r = frameData[i] * params.red;
            let g = frameData[i + 1] * params.green;
            let b = frameData[i + 2] * params.blue;
            const gray = (r + g + b) / 3;
            r = gray + (r - gray) * params.saturation;
            g = gray + (g - gray) * params.saturation;
            b = gray + (b - gray) * params.saturation;
            r += (255 - r) * (params.brightness - 1);
            g += (255 - g) * (params.brightness - 1);
            b += (255 - b) * (params.brightness - 1);
            r = ((r / 255 - 0.5) * params.contrast + 0.5) * 255;
            g = ((g / 255 - 0.5) * params.contrast + 0.5) * 255;
            b = ((b / 255 - 0.5) * params.contrast + 0.5) * 255;
            frameData[i] = Math.min(255, Math.max(0, r));
            frameData[i + 1] = Math.min(255, Math.max(0, g));
            frameData[i + 2] = Math.min(255, Math.max(0, b));
        }
        return frameData;
    }
    
    init(videoElement, canvasElement) {
        this.videoElement = videoElement;
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.isActive = true;
        
        const updateSize = () => {
            if (this.videoElement.videoWidth) {
                this.canvas.width = this.videoElement.videoWidth;
                this.canvas.height = this.videoElement.videoHeight;
                console.log(`Canvas: ${this.canvas.width}x${this.canvas.height}`);
            }
        };
        
        this.videoElement.addEventListener('loadedmetadata', updateSize);
        updateSize();
        this.startProcessing();
    }
    
    startProcessing() {
        const processFrame = () => {
            if (!this.isActive) return;
            if (this.videoElement && !this.videoElement.paused && !this.videoElement.ended && this.videoElement.videoWidth > 0) {
                try {
                    this.ctx.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);
                    if (this.currentFilter !== 'default') {
                        const frameData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                        const filteredData = this.filters[this.currentFilter](frameData.data, this.canvas.width, this.canvas.height);
                        this.ctx.putImageData(new ImageData(filteredData, this.canvas.width, this.canvas.height), 0, 0);
                    } else if (this.params.colorTones.red !== 1 || this.params.colorTones.green !== 1 || 
                               this.params.colorTones.blue !== 1 || this.params.colorTones.saturation !== 1 ||
                               this.params.colorTones.brightness !== 1 || this.params.colorTones.contrast !== 1) {
                        const frameData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                        const adjustedData = this.applyColorAdjustments(frameData.data);
                        this.ctx.putImageData(new ImageData(adjustedData, this.canvas.width, this.canvas.height), 0, 0);
                    }
                    this.time += 0.03;
                } catch (e) {
                    console.warn('Error:', e);
                }
            }
            this.animationFrame = requestAnimationFrame(processFrame);
        };
        processFrame();
    }
    
    updateParam(filter, param, value) {
        if (this.params[filter] && this.params[filter][param] !== undefined) {
            this.params[filter][param] = value;
        }
    }
    
    setFilter(filterName) {
        if (this.filters[filterName]) {
            this.currentFilter = filterName;
            const filterStatus = document.getElementById('filterStatus');
            if (filterStatus) {
                const names = {
                    default: 'Normal', shockwave: '1. Onda de choque', kaleidoscope: '2. Caleidoscopio',
                    pixelGlitch: '3. Pixel Glitch', waveDistortion: '4. Onda sinusoidal', blackHole: '5. Agujero negro',
                    pixelSorting: '6. Pixel Sorting', liquidRipple: '7. Líquido', chromaticAberration: '8. Aberración cromática',
                    mirror: '9. Espejo', colorTones: '10. Ajustes de color'
                };
                filterStatus.textContent = names[filterName] || 'Normal';
            }
            this.updateControlsForFilter(filterName);
        }
    }
    
    updateControlsForFilter(filterName) {
        const panel = document.getElementById('filterControls');
        if (!panel) return;
        
        let html = '<div class="space-y-3 max-h-96 overflow-y-auto">';
        switch(filterName) {
            case 'shockwave':
                html += this.createSlider('Intensidad', 'intensity', 0, 1, this.params.shockwave.intensity);
                html += this.createSlider('Velocidad', 'speed', 0.5, 2, this.params.shockwave.speed);
                html += this.createSlider('Tamaño', 'size', 0.5, 1.5, this.params.shockwave.size);
                break;
            case 'kaleidoscope':
                html += this.createSlider('Segmentos', 'segments', 3, 12, this.params.kaleidoscope.segments, 1);
                html += this.createSlider('Rotación', 'rotation', 0, 6.28, this.params.kaleidoscope.rotation);
                html += this.createSlider('Escala', 'scale', 0.5, 2, this.params.kaleidoscope.scale);
                break;
            case 'pixelGlitch':
                html += this.createSlider('Tamaño pixel', 'pixelSize', 2, 20, this.params.pixelGlitch.pixelSize, 1);
                html += this.createSlider('Intensidad', 'glitchAmount', 0, 1, this.params.pixelGlitch.glitchAmount);
                html += this.createSlider('Altura banda', 'bandHeight', 5, 40, this.params.pixelGlitch.bandHeight, 1);
                break;
            case 'waveDistortion':
                html += this.createSlider('Amplitud X', 'amplitudeX', 0, 50, this.params.waveDistortion.amplitudeX, 1);
                html += this.createSlider('Amplitud Y', 'amplitudeY', 0, 40, this.params.waveDistortion.amplitudeY, 1);
                html += this.createSlider('Frecuencia', 'frequency', 0.02, 0.15, this.params.waveDistortion.frequency);
                html += this.createSlider('Velocidad', 'speed', 0.5, 3, this.params.waveDistortion.speed);
                break;
            case 'blackHole':
                html += this.createSlider('Fuerza', 'strength', 0.3, 1.5, this.params.blackHole.strength);
                html += this.createSlider('Torsión', 'twist', 0.5, 4, this.params.blackHole.twist);
                html += this.createSlider('Tamaño', 'size', 0.5, 1.5, this.params.blackHole.size);
                break;
            case 'pixelSorting':
                html += this.createSlider('Umbral', 'threshold', 0.1, 0.8, this.params.pixelSorting.threshold);
                html += this.createSlider('Altura línea', 'lineHeight', 3, 30, this.params.pixelSorting.lineHeight, 1);
                break;
            case 'liquidRipple':
                html += this.createSlider('Amplitud', 'amplitude', 0, 30, this.params.liquidRipple.amplitude, 1);
                html += this.createSlider('Frecuencia', 'frequency', 0.05, 0.3, this.params.liquidRipple.frequency);
                html += this.createSlider('Velocidad', 'speed', 2, 10, this.params.liquidRipple.speed);
                html += this.createSlider('Decaimiento', 'decay', 0.5, 2, this.params.liquidRipple.decay);
                break;
            case 'chromaticAberration':
                html += this.createSlider('Intensidad', 'intensity', 0, 30, this.params.chromaticAberration.intensity, 1);
                html += this.createSlider('Ángulo', 'angle', 0, 6.28, this.params.chromaticAberration.angle);
                html += this.createSlider('Onda', 'waveEffect', 0, 0.05, this.params.chromaticAberration.waveEffect);
                break;
            case 'mirror':
                html += `
                    <div class="mb-3">
                        <label class="text-white text-sm block mb-1">Orientación</label>
                        <select id="mirror_orientation" class="w-full px-3 py-2 rounded-lg bg-gray-800 text-white text-sm">
                            <option value="vertical" ${this.params.mirror.orientation === 'vertical' ? 'selected' : ''}>Vertical</option>
                            <option value="horizontal" ${this.params.mirror.orientation === 'horizontal' ? 'selected' : ''}>Horizontal</option>
                        </select>
                    </div>
                `;
                html += this.createSlider('Desplazamiento', 'offset', -100, 100, this.params.mirror.offset, 1);
                html += this.createSlider('Mezcla', 'blend', 0, 1, this.params.mirror.blend);
                break;
            case 'colorTones':
                html += '<div class="text-center text-white text-xs mb-2">AJUSTES DE COLOR</div>';
                html += this.createSlider('Rojo', 'red', 0, 2, this.params.colorTones.red);
                html += this.createSlider('Verde', 'green', 0, 2, this.params.colorTones.green);
                html += this.createSlider('Azul', 'blue', 0, 2, this.params.colorTones.blue);
                html += this.createSlider('Saturación', 'saturation', 0, 2, this.params.colorTones.saturation);
                html += this.createSlider('Brillo', 'brightness', 0.5, 1.5, this.params.colorTones.brightness);
                html += this.createSlider('Contraste', 'contrast', 0.5, 2, this.params.colorTones.contrast);
                break;
            default:
                html += '<div class="text-white/70 text-center text-sm">Normal</div>';
        }
        html += '</div>';
        panel.innerHTML = html;
        this.attachEvents(filterName);
    }
    
    createSlider(label, param, min, max, value, step = 0.01) {
        return `
            <div class="mb-3">
                <label class="text-white/80 text-xs block mb-1">${label}: <span id="${param}_val" class="text-brand-medium">${value.toFixed(2)}</span></label>
                <input type="range" id="${param}" min="${min}" max="${max}" step="${step}" value="${value}" class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer">
            </div>
        `;
    }
    
    attachEvents(filterName) {
        for (let param of Object.keys(this.params[filterName])) {
            const slider = document.getElementById(param);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    const val = parseFloat(e.target.value);
                    this.updateParam(filterName, param, val);
                    const span = document.getElementById(`${param}_val`);
                    if (span) span.textContent = val.toFixed(2);
                });
            }
        }
        const orient = document.getElementById('mirror_orientation');
        if (orient) {
            orient.addEventListener('change', (e) => this.updateParam('mirror', 'orientation', e.target.value));
        }
    }
    
    stopProcessing() {
        this.isActive = false;
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    }
    
    cleanup() {
        this.stopProcessing();
        if (this.canvas && this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Inicialización
let videoFilterSystem = null;

document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('opcFiltro');
    if (select) {
        select.innerHTML = `
            <option value="default">Normal</option>
            <option value="shockwave">1. Onda de choque</option>
            <option value="kaleidoscope">2. Caleidoscopio</option>
            <option value="pixelGlitch">3. Pixel Glitch</option>
            <option value="waveDistortion">4. Onda sinusoidal</option>
            <option value="blackHole">5. Agujero negro</option>
            <option value="pixelSorting">6. Pixel Sorting</option>
            <option value="liquidRipple">7. Líquido/Ripple</option>
            <option value="chromaticAberration">8. Aberración cromática</option>
            <option value="mirror">9. Efecto espejo</option>
            <option value="colorTones">10. Ajustes de color</option>
        `;
        
        const submenu = document.querySelector('.submenu');
        if (submenu) {
            // Estado del filtro
            const statusDiv = document.createElement('div');
            statusDiv.className = 'text-center mt-2';
            
            submenu.appendChild(statusDiv);
            
            // Panel de controles (scrollable para móvil)
            const controls = document.createElement('div');
            controls.id = 'filterControls';
            controls.className = 'mt-3 p-3 bg-black/50 rounded-xl backdrop-blur-sm border border-white/20 max-h-64 overflow-y-auto';
            controls.innerHTML = '<div class="text-white/70 text-center text-xs">Normal</div>';
            submenu.appendChild(controls);
        }
        
        select.addEventListener('change', (e) => {
            if (videoFilterSystem && e.target.value !== 'default') {
                videoFilterSystem.setFilter(e.target.value);
            } else if (videoFilterSystem) {
                videoFilterSystem.setFilter('default');
                const panel = document.getElementById('filterControls');
                if (panel) panel.innerHTML = '<div class="text-white/70 text-center text-xs">Normal</div>';
            }
        });
    }
});

// Esperar al video
const setupVideo = () => {
    const check = setInterval(() => {
        const video = document.getElementById('videoPlayer');
        if (video && video.readyState >= 1 && !videoFilterSystem) {
            clearInterval(check);
            const container = document.getElementById('videoContainer');
            if (container) {
                const oldCanvas = document.getElementById('filterCanvas');
                if (oldCanvas) oldCanvas.remove();
                
                video.style.display = 'block';
                let card = container.querySelector('.card') || container.querySelector('.cardQuestion');
                if (!card) {
                    card = document.createElement('div');
                    card.className = 'card relative';
                    video.parentNode.insertBefore(card, video);
                    card.appendChild(video);
                }
                card.style.position = 'relative';
                
                const canvas = document.createElement('canvas');
                canvas.id = 'filterCanvas';
                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.style.borderRadius = '12px';
                canvas.style.pointerEvents = 'none';
                canvas.style.zIndex = '10';
                card.appendChild(canvas);
                
                videoFilterSystem = new VideoFilterSystem();
                videoFilterSystem.init(video, canvas);
                console.log(' Sistema listo');
            }
        }
    }, 300);
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupVideo);
else setupVideo();

window.addEventListener('beforeunload', () => videoFilterSystem?.cleanup());