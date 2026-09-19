// Pengelola Peta Cyber Dungeon
const DungeonManager = {
    rooms: [
        { id: 1, name: "RUANGAN 01 — LAB AWAL", desc: "Perbaiki masalah ketidakcocokan Socket CPU dan Motherboard.", unlocked: true, completed: false },
        { id: 2, name: "RUANGAN 02 — PC RUSAK", desc: "Komputer mati mendadak akibat daya PSU yang kurang.", unlocked: false, completed: false },
        { id: 3, name: "RUANGAN 03 — LAB PROCESSOR", desc: "Rakit sistem berperforma tinggi tanpa mengalami overheating.", unlocked: false, completed: false },
        { id: 4, name: "RUANGAN 04 — LAB MEMORI", desc: "Uji pencocokan tipe memori RAM dan Motherboard.", unlocked: false, completed: false },
        { id: 5, name: "RUANGAN 05 — RUANG POWER", desc: "Selesaikan perhitungan konsumsi daya listrik seluruh komponen.", unlocked: false, completed: false },
        { id: 6, name: "RUANGAN 06 — KOMPUTER INTI", desc: "Rakit PC impian utuh untuk mengaktifkan kembali Inti Cyber.", unlocked: false, completed: false }
    ],

    init() {
        this.renderRooms();
    },

    renderRooms() {
        const container = document.getElementById('dungeon-rooms-container');
        if (!container) return;
        container.innerHTML = '';

        this.rooms.forEach(room => {
            const card = document.createElement('div');
            let statusClass = room.completed ? 'completed' : (room.unlocked ? 'unlocked' : 'locked');
            let statusText = room.completed ? '✅ TERSELESAIKAN' : (room.unlocked ? 'TERBUKA' : '🔒 TERKUNCI');

            card.className = `room-card ${statusClass}`;
            card.innerHTML = `
                <span class="room-status">${statusText}</span>
                <h3>${room.name}</h3>
                <p style="font-size:0.85rem; color: var(--text-muted); margin-top:8px;">${room.desc}</p>
            `;

            if (room.unlocked) {
                card.addEventListener('click', () => {
                    AssemblyLab.loadRoomMission(room);
                    MainApp.switchView('view-assembly-lab');
                });
            }

            container.appendChild(card);
        });
    },

    completeRoom(roomId) {
        const current = this.rooms.find(r => r.id === roomId);
        if (current) {
            current.completed = true;
            const next = this.rooms.find(r => r.id === roomId + 1);
            if (next) next.unlocked = true;
            this.renderRooms();
            MainApp.addXP(150);
            MainApp.saveProgress();
        }
    }
};