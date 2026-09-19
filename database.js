// Pengelola Database Lokal
const CyberDatabase = {
    components: [],
    compatibility: {},
    questions: [],

    async init() {
        try {
            const [compRes, compatRes, questRes] = await Promise.all([
                fetch('data/components.json'),
                fetch('data/compatibility.json'),
                fetch('data/questions.json')
            ]);

            this.components = await compRes.json();
            this.compatibility = await compatRes.json();
            this.questions = await questRes.json();
            console.log("Database Cyber Dungeon Berhasil Dimuat.");
        } catch (err) {
            console.error("Gagal memuat database JSON:", err);
        }
    },

    getAllComponents() { return this.components; },
    getComponentById(id) { return this.components.find(c => c.id === id); },
    getQuestions() { return this.questions; }
};