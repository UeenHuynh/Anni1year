/*
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║     CHỈNH THIỆP TẠI ĐÂY — không cần sửa index.html hay app.js        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 * 1. Thay letterTitle, letterParagraphs và signature để đổi lời chúc.
 * 2. Copy bài hát có quyền sử dụng vào assets/audio/; sửa musicFile.
 * 3. Copy video của hai bạn vào assets/video/; sửa videoFile.
 * 4. readDurationMs = 5000 nghĩa là giữ thiệp để đọc ~5 giây rồi mở video.
 * 5. Có thể sửa finalTitle / finalLineOne / finalName ngay tại đây.
 *
 * Hình: Wikimedia Commons, tác phẩm public-domain / ảnh PD-self.
 * Khi có Internet lần đầu: chạy python tools/download_art.py để tải về local.
 */
window.CARD_CONFIG = {
  letterTitle: 'Khanh Binh, my forever',
  letterParagraphs: [
    'Bình yêu của anh,',
    'Nếu được chọn lại giữa muôn vạn cuộc đời, anh vẫn sẽ tìm em — như cách các vì sao tìm thấy bầu trời của mình.',
    'Cảm ơn em vì đã đến, vì đã ở lại và vì đã khiến hai chữ “mãi mãi” trở nên dịu dàng đến thế.',
    'Happy anniversary, my love. Anh yêu em, hôm nay và mọi ngày sau nữa.'
  ],
  signature: 'Forever yours ♡',
  readDurationMs: 5000,

  // Âm thanh sẽ bắt đầu ngay khi click 1, chạy suốt lúc mở và đọc thiệp.
  // KHÔNG chứa bài remix có bản quyền. Bạn tự thêm file hợp pháp theo đường dẫn này.
  musicFile: 'assets/audio/ngai-ngung-khong-the-cat-loi-remix.mp3',
  musicDemoFile: 'assets/audio/pastel-waltz-demo.mp3',
  musicVolume: 0.56,

  // Tự copy video riêng vào đây. Nếu chưa có, trang dùng video DEMO đi kèm.
  videoFile: 'assets/video/our-story.mp4',
  videoDemoFile: 'assets/video/demo-memory.mp4',

  finalTitle: 'Happy anniversary',
  finalLineOne: 'I love you, my wife',
  finalName: 'Le Ha Khanh Binh',

  // Hình thực tế tải từ Wikimedia Commons, KHÔNG phải hình AI tạo.
  // Tệp images/*.jpg nếu đã tải được sẽ được ưu tiên, nếu chưa có sẽ dùng URL web.
  artwork: {
    venus: {
      local: 'assets/images/venus.jpg',
      file: 'Nascita_di_Venere_Botticelli.jpg',
      credit: 'Sandro Botticelli, The Birth of Venus, c. 1485 — Wikimedia Commons, Public Domain'
    },
    canova: {
      local: 'assets/images/canova.jpg',
      file: 'Antonio Canova - Psyche revived by the kiss of Love, Marble, 1793.jpg',
      credit: 'Antonio Canova, Psyche Revived by Cupid’s Kiss, Louvre — photo: Siren-Com, Public Domain (PD-self)'
    },
    primavera: {
      local: 'assets/images/primavera.jpg',
      file: 'Botticelli_Primavera.jpg',
      credit: 'Sandro Botticelli, Primavera — Wikimedia Commons, Public Domain'
    },
    graces: {
      local: 'assets/images/graces.jpg',
      file: 'Raphaël - Les Trois Grâces - Google Art Project.jpg',
      credit: 'Raphael, The Three Graces, c. 1504 — Wikimedia Commons / Google Art Project, Public Domain'
    },
    mars: {
      local: 'assets/images/mars.jpg',
      file: 'Sandro Botticelli - Venus and Mars - WGA2776.jpg',
      credit: 'Sandro Botticelli, Venus and Mars — Web Gallery of Art / Wikimedia Commons, Public Domain'
    },
    roman: {
      local: 'assets/images/roman.jpg',
      file: 'Fresco depicting winged Cupid and Psyche from the west wall of the exedra in the Casa di Bronzi aka Casa della Parete Nera in Pompeii by Wilhelm Zahn.jpg',
      credit: 'Pompeii, Cupid and Psyche, illustration by Wilhelm Zahn (d. 1871) — Wikimedia Commons, Public Domain'
    }
  }
};

// Original artwork URLs for the browser fallback (no image generation).
window.CARD_ART_URLS = {
  "venus": "https://upload.wikimedia.org/wikipedia/commons/9/9e/Nascita_di_Venere_Botticelli.jpg",
  "canova": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Antonio_Canova_-_Psyche_revived_by_the_kiss_of_Love%2C_Marble%2C_1793.jpg",
  "primavera": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Botticelli_Primavera.jpg",
  "graces": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Rapha%C3%ABl_-_Les_Trois_Gr%C3%A2ces_-_Google_Art_Project.jpg",
  "mars": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Sandro_Botticelli_-_Venus_and_Mars_-_WGA2776.jpg",
  "roman": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Fresco_depicting_winged_Cupid_and_Psyche_from_the_west_wall_of_the_exedra_in_the_Casa_di_Bronzi_aka_Casa_della_Parete_Nera_in_Pompeii_by_Wilhelm_Zahn.jpg"
};
