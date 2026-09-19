// Inisialisasi Aplikasi Utama
const MainApp = {
    playerXP: 0,
    playerLevel: 1,

    async init() {
        await CyberDatabase.init();
        DungeonManager.init();
        this.loadProgress();
        this.bindEvents();
        this.renderEncyclopedia();
    },

    bindEvents() {
        // Navigasi Halaman
        document.getElementById('btn-start-game').addEventListener('click', () => this.switchView('view-dungeon-map'));
        document.getElementById('btn-encyclopedia').addEventListener('click', () => this.switchView('view-encyclopedia'));
        document.getElementById('btn-how-to-play').addEventListener('click', () => this.showInfoModal('Cara Bermain', '1. Masuk ke Peta Dungeon.<br>2. Selesaikan misi perakitan di tiap ruangan.<br>3. Perhatikan kompatibilitas socket dan daya PSU.<br>4. Kumpulkan XP dan buka seluruh ruangan!'));
        document.getElementById('btn-settings').addEventListener('click', () => this.showInfoModal('Pengaturan', 'Fitur audio dan kustomisasi tema akan hadir di pembaruan selanjutnya.'));

        document.querySelectorAll('.btn-to-menu').forEach(btn => btn.addEventListener('click', () => this.switchView('view-main-menu')));
        document.querySelectorAll('.btn-to-map').forEach(btn => btn.addEventListener('click', () => this.switchView('view-dungeon-map')));

        // Aksi Verifikasi dan Quiz
        document.getElementById('btn-verify-system').addEventListener('click', () => AssemblyLab.verifyAssembly());
        document.getElementById('btn-open-quiz').addEventListener('click', () => QuizManager.startQuiz());
        document.getElementById('btn-next-quiz').addEventListener('click', () => QuizManager.nextQuestion());

        // Tombol Tutup Modal
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.cyber-modal').classList.remove('active');
            });
        });

        // Pencarian Ensiklopedia
        document.getElementById('search-hardware').addEventListener('input', () => this.renderEncyclopedia());
        document.getElementById('filter-category').addEventListener('change', () => this.renderEncyclopedia());

        // Reset Simpanan Game
        document.getElementById('btn-save-reset').addEventListener('click', () => {
            if (confirm('Apakah Anda yakin ingin mereset seluruh simpanan progres game?')) {
                localStorage.clear();
                location.reload();
            }
        });
    },

    switchView(viewId) {
        document.querySelectorAll('.view-screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(viewId);
        if (target) target.classList.add('active');
    },

    addXP(amount) {
        this.playerXP += amount;
        this.playerLevel = Math.floor(this.playerXP / 200) + 1;
        document.getElementById('player-xp').innerText = this.playerXP;
        document.getElementById('player-level').innerText = this.playerLevel;
        this.saveProgress();
    },

    renderEncyclopedia() {
        const search = document.getElementById('search-hardware').value.toLowerCase();
        const cat = document.getElementById('filter-category').value;
        const listContainer = document.getElementById('hardware-list-container');
        
        listContainer.innerHTML = '';

        const filtered = CyberDatabase.getAllComponents().filter(c => {
            const matchSearch = c.name.toLowerCase().includes(search) || c.description.toLowerCase().includes(search);
            const matchCat = cat === 'ALL' || c.category === cat;
            return matchSearch && matchCat;
        });

        filtered.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'hardware-item-btn';
            btn.innerText = item.name;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.hardware-item-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.showHardwareDetail(item);
            });
            listContainer.appendChild(btn);
        });
    },

    showHardwareDetail(item) {
        const panel = document.getElementById('hardware-detail-panel');
        panel.innerHTML = `
            <h2 style="color:var(--neon-blue);">${item.name}</h2>
            <p style="margin:10px 0;"><strong>Kategori:</strong> ${item.category}</p>
            <p><strong>Deskripsi:</strong> ${item.description}</p>
            <hr style="border-color:var(--panel-border); margin:15px 0;">
            <p><strong>Fungsi Utama:</strong> ${item.function}</p>
            <p><strong>Konsumsi Daya:</strong> ${item.power_watt} Watt</p>
            <p style="margin-top:10px;"><strong>Spesifikasi Utama:</strong></p>
            <pre style="background:#000; padding:10px; color:var(--neon-green); margin-top:5px;">${JSON.stringify(item.specifications, null, 2)}</pre>
            <div style="margin-top:15px; background:rgba(255,204,0,0.1); border-left:3px solid var(--neon-yellow); padding:10px;">
                <strong>💡 Fakta Edukasi:</strong> ${item.educational_facts.join(' ')}
            </div>
        `;
    },

    showInfoModal(title, bodyHtml) {
        document.getElementById('modal-info-title').innerText = title;
        document.getElementById('modal-info-body').innerHTML = bodyHtml;
        document.getElementById('modal-info').classList.add('active');
    },

    saveProgress() {
        const saveData = {
            xp: this.playerXP,
            rooms: DungeonManager.rooms
        };
        localStorage.setItem('PC_BUILDER_SAVE', JSON.stringify(saveData));
    },

    loadProgress() {
        const data = localStorage.getItem('PC_BUILDER_SAVE');
        if (data) {
            const parsed = JSON.parse(data);
            this.playerXP = parsed.xp || 0;
            this.playerLevel = Math.floor(this.playerXP / 200) + 1;
            document.getElementById('player-xp').innerText = this.playerXP;
            document.getElementById('player-level').innerText = this.playerLevel;
            if (parsed.rooms) {
                DungeonManager.rooms = parsed.rooms;
                DungeonManager.renderRooms();
            }
        }
    }
};

window.addEventListener('DOMContentLoaded', () => MainApp.init());