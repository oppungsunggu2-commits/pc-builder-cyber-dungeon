// Pengelola Bengkel Perakitan & Sistem Drag-and-Drop
let selectedInventoryItem = null;

const AssemblyLab = {
    currentRoom: null,
    installedComponents: {},

    loadRoomMission(room) {
        this.currentRoom = room;
        document.getElementById('room-lab-title').innerText = room.name;
        document.getElementById('mission-brief-bar').innerHTML = `<strong>OBJEKTIF MISI:</strong> ${room.desc}`;
        this.installedComponents = {};
        selectedInventoryItem = null;
        this.resetSlots();
        this.renderInventory();
        this.updateSystemMetrics();
    },

    resetSlots() {
        document.querySelectorAll('.drop-slot').forEach(slot => {
            slot.classList.remove('filled', 'slot-highlight');
            slot.querySelector('.installed-item').innerHTML = '';
        });
    },

    renderInventory() {
        const container = document.getElementById('inventory-list-container');
        if (!container) return;
        container.innerHTML = '';
        
        CyberDatabase.getAllComponents().forEach(item => {
            const el = document.createElement('div');
            el.className = 'inventory-item';
            el.draggable = true;
            el.innerHTML = `
                <strong>${item.name}</strong>
                <div style="font-size:0.75rem; color:var(--text-muted);">${item.category} | ${item.power_watt}W</div>
            `;

            // Drag & Drop Laptop
            el.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.id);
            });

            // Tap/Klik HP & Laptop
            el.addEventListener('click', () => {
                document.querySelectorAll('.inventory-item').forEach(i => i.style.borderColor = 'var(--panel-border)');
                selectedInventoryItem = item;
                el.style.borderColor = 'var(--neon-green)';
                
                document.querySelectorAll('.drop-slot').forEach(slot => {
                    slot.classList.add('slot-highlight');
                });
            });

            container.appendChild(el);
        });

        this.setupDropZones();
    },

    setupDropZones() {
        document.querySelectorAll('.drop-slot').forEach(slot => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                slot.classList.add('drag-over');
            });

            slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));

            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                const itemId = e.dataTransfer.getData('text/plain');
                const item = CyberDatabase.getComponentById(itemId);
                if (item) this.installItemToSlot(slot, item);
            });

            slot.addEventListener('click', () => {
                if (selectedInventoryItem) {
                    this.installItemToSlot(slot, selectedInventoryItem);
                    selectedInventoryItem = null;
                    document.querySelectorAll('.inventory-item').forEach(i => i.style.borderColor = 'var(--panel-border)');
                    document.querySelectorAll('.drop-slot').forEach(s => s.classList.remove('slot-highlight'));
                }
            });
        });
    },

    installItemToSlot(slot, item) {
        const slotType = slot.dataset.slotType;
        
        this.installedComponents[slotType] = item;
        slot.classList.add('filled');
        slot.querySelector('.installed-item').innerHTML = `<span style="color:var(--neon-green)">${item.name}</span>`;

        this.updateSystemMetrics();
    },

    updateSystemMetrics() {
        let totalPower = 0;
        let psuCapacity = 0;
        let hasCooler = false;
        let cpuPower = 0;

        Object.values(this.installedComponents).forEach(comp => {
            if (comp.category === 'Power Supply') {
                psuCapacity = parseInt(comp.specifications.kapasitas) || 0;
            } else {
                totalPower += comp.power_watt;
            }

            if (comp.category === 'Cooling') hasCooler = true;
            if (comp.category === 'Processor') cpuPower = comp.power_watt;
        });

        const powerBar = document.getElementById('power-bar');
        const powerText = document.getElementById('power-status-text');
        if (powerBar && powerText) {
            let powerPercentage = psuCapacity > 0 ? Math.min(100, (totalPower / psuCapacity) * 100) : 0;
            powerBar.style.width = `${powerPercentage}%`;

            if (psuCapacity > 0 && totalPower > psuCapacity) {
                powerBar.style.background = 'var(--neon-red)';
                powerText.innerText = `${totalPower}W / ${psuCapacity}W (DAYA BERLEBIH!)`;
            } else {
                powerBar.style.background = 'var(--neon-green)';
                powerText.innerText = `${totalPower}W / ${psuCapacity}W (Stabil)`;
            }
        }

        const thermalBar = document.getElementById('thermal-bar');
        const thermalText = document.getElementById('thermal-status-text');
        if (thermalBar && thermalText) {
            let temp = 30 + (cpuPower > 0 ? (hasCooler ? 15 : 55) : 0);
            thermalBar.style.width = `${Math.min(100, temp)}%`;
            if (temp > 75) {
                thermalBar.style.background = 'var(--neon-red)';
                thermalText.innerText = `${temp}°C (OVERHEATING!)`;
            } else {
                thermalBar.style.background = 'var(--neon-green)';
                thermalText.innerText = `${temp}°C (Stabil)`;
            }
        }
    },

    verifyAssembly() {
        const log = document.getElementById('diagnostic-log');
        const cpu = this.installedComponents['CPU'];
        const psu = this.installedComponents['PSU'];
        const ram = this.installedComponents['RAM'];

        if (!cpu || !psu || !ram) {
            log.innerHTML = `<span style="color:var(--neon-red)">❌ ERROR: Komponen dasar (CPU, RAM, dan PSU) belum lengkap terpasang di papan!</span>`;
            return;
        }

        if (cpu.id === 'cpu_am5_ryzen' && ram.id === 'ram_16gb_ddr4') {
            log.innerHTML = `<span style="color:var(--neon-red)">❌ TIDAK KOMPATIBEL!<br>Processor ${cpu.name} (Socket AM5) memerlukan RAM DDR5, tidak cocok dengan RAM DDR4!</span>`;
            return;
        }

        log.innerHTML = `<span style="color:var(--neon-green)">✅ VERIFIKASI BERHASIL! Sistem berjalan stabil.<br>Misi Ruangan Selesai!</span>`;
        
        setTimeout(() => {
            if (this.currentRoom) {
                DungeonManager.completeRoom(this.currentRoom.id);
                alert(`Selamat! Anda berhasil menyelesaikan ${this.currentRoom.name}. Hadiah: +150 XP!`);
                MainApp.switchView('view-dungeon-map');
            }
        }, 1000);
    }
};