// Logika Peta Dungeon & Level Game
const CyberDungeon = {
    levels: [
        { id: 1, name: "Lab 1: Komputer Kantoran Dasar", reqXp: 0, desc: "Rakit PC kantor standar dengan budget minim." },
        { id: 2, name: "Lab 2: Upgrade Dual Channel RAM", reqXp: 100, desc: "Pasang Dual Channel RAM untuk performa multitasking." },
        { id: 3, name: "Lab 3: PC Gaming Entry-Level", reqXp: 250, desc: "Rakit PC gaming murah dengan Dedicated GPU." },
        { id: 4, name: "Lab 4: Manajemen Daya & PSU", reqXp: 450, desc: "Pilih Power Supply bersertifikasi agar sistem aman." },
        { id: 5, name: "Lab 5: PC Streamer & Editing", reqXp: 700, desc: "Kombinasi CPU Multi-core dan RAM kapasitas besar." },
        { id: 6, name: "Lab 6: Sistem Pendingin AIO Liquid", reqXp: 1000, desc: "Mengatasi Overheating dengan Liquid Cooler." },
        { id: 7, name: "Lab 7: Stasiun Workstation 3D", reqXp: 1350, desc: "Rakit PC spesifikasi ekstrem untuk rendering." },
        { id: 8, name: "Lab 8: Troubleshooting No Display", reqXp: 1750, desc: "Diagnosa dan perbaiki masalah monitor hitam." },
        { id: 9, name: "Lab 9: Diagnosa PC Boot Loop", reqXp: 2200, desc: "Atasi masalah komputer yang mati nyala sendiri." },
        { id: 10, name: "Lab Final: Cyber Master Rig", reqXp: 2700, desc: "Rakit PC impian terbaik di dunia Cyber Dungeon!" }
    ],

    init() {
        this.renderMap();
    },

    renderMap() {
        const grid = document.getElementById('dungeon-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        const currentXp = parseInt(localStorage.getItem('cyber_xp') || '0');

        this.levels.forEach(lvl => {
            const isUnlocked = currentXp >= lvl.reqXp;
            const card = document.createElement('div');
            card.className = `dungeon-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            card.style.cssText = "border: 1px solid #00f3ff; margin: 10px; padding: 15px; background: rgba(0,243,255,0.1); border-radius: 5px; cursor: pointer;";
            
            card.innerHTML = `
                <div class="level-badge" style="color: #00f3ff; font-weight: bold;">LEVEL ${lvl.id}</div>
                <h4 style="margin: 5px 0; color: #fff;">${lvl.name}</h4>
                <p style="font-size: 12px; color: #ccc;">${lvl.desc}</p>
                <div class="status" style="margin-top: 10px; font-weight: bold; color: ${isUnlocked ? '#00ff88' : '#ff0055'};">
                    ${isUnlocked ? '🔓 TERBUKA (KLIK UNTUK MASUK)' : `🔒 TERKUNCI (Butuh ${lvl.reqXp} XP)`}
                </div>
            `;

            if (isUnlocked) {
                card.addEventListener('click', () => {
                    if (window.CyberAssembly) {
                        window.CyberAssembly.loadLevel(lvl.id);
                    }
                });
            }

            grid.appendChild(card);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CyberDungeon.init();
});
