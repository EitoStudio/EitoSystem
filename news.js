// GoogleスプレッドシートのIDとシート名
const SPREADSHEET_ID = '13_Pjk2Pw5_-U_y0rXZH0O_4lzeSzgizNeXT8Mvudr7I';
const SHEET_NAME = 'Sheet2';
const API_KEY = 'AIzaSyCazWIoHruLB0TzdGR-ltnn5TLWoX3cgwI';

// ソート順の設定
let sortOrder = 'date'; // 'date' または 'title'
let sortDirection = 'desc'; // 'desc' または 'asc'

// ニュースデータを取得する関数
async function fetchNewsData() {
    try {
        // GoogleスプレッドシートのAPIエンドポイント
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('データの取得に失敗しました');
        }
        
        const data = await response.json();
        
        // データが存在しない場合
        if (!data.values || data.values.length <= 1) {
            return [];
        }
        
        // ヘッダー行をスキップしてデータを整形
        const newsItems = data.values.slice(1).map(row => {
            // 日付データをそのまま使用（変換せずに）
            return {
                date: row[0] || '',
                title: row[1] || '',
                subtitle: row[2] || '',
                details: row[3] || ''
            };
        });
        
        // ソート順に応じてデータをソート
        return sortNewsItems(newsItems);
    } catch (error) {
        console.error('ニュースデータの取得エラー:', error);
        return [];
    }
}

// ニュース項目をソートする関数
function sortNewsItems(newsItems) {
    return newsItems.sort((a, b) => {
        // 空の値は最後に
        if (!a[sortOrder]) return 1;
        if (!b[sortOrder]) return -1;
        
        // ソート方向に応じて比較
        const comparison = a[sortOrder].localeCompare(b[sortOrder]);
        return sortDirection === 'desc' ? -comparison : comparison;
    });
}

// ソート順を切り替える関数
function toggleSort(newOrder) {
    if (sortOrder === newOrder) {
        // 同じ項目でソートする場合は方向を反転
        sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    } else {
        // 異なる項目でソートする場合はデフォルトで降順
        sortOrder = newOrder;
        sortDirection = 'desc';
    }
    
    // ソートアイコンを更新
    updateSortIcons();
    
    // ニュースを再表示
    displayNews();
}

// ソートアイコンを更新する関数
function updateSortIcons() {
    const dateSortIcon = document.querySelector('.sort-date i');
    const titleSortIcon = document.querySelector('.sort-title i');
    
    // すべてのアイコンをリセット
    if (dateSortIcon) dateSortIcon.className = 'fas fa-sort';
    if (titleSortIcon) titleSortIcon.className = 'fas fa-sort';
    
    // 現在のソート項目のアイコンを更新
    if (sortOrder === 'date') {
        if (dateSortIcon) dateSortIcon.className = `fas fa-sort-${sortDirection === 'desc' ? 'down' : 'up'}`;
    } else if (sortOrder === 'title') {
        if (titleSortIcon) titleSortIcon.className = `fas fa-sort-${sortDirection === 'desc' ? 'down' : 'up'}`;
    }
}

// ニュース項目をHTMLに変換する関数
function createNewsItemHTML(newsItem) {
    // 日付をそのまま表示（変換せずに）
    const formattedDate = newsItem.date;
    
    return `
        <div class="news-item">
            <div class="news-date">${formattedDate}</div>
            <div class="news-content">
                <div class="news-title">${newsItem.title}</div>
                <div class="news-subtitle">${newsItem.subtitle}</div>
                <button class="news-details-btn" data-date="${newsItem.date}" data-title="${newsItem.title}" data-subtitle="${newsItem.subtitle}" data-details="${encodeURIComponent(newsItem.details)}">
                    詳細を見る <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    `;
}

// 詳細モーダルを作成する関数
function createDetailsModal() {
    const modal = document.createElement('div');
    modal.className = 'news-details-modal';
    modal.innerHTML = `
        <div class="news-details-content">
            <button class="news-details-close"><i class="fas fa-times"></i></button>
            <div class="news-details-header">
                <div class="news-details-date"></div>
                <div class="news-details-title"></div>
                <div class="news-details-subtitle"></div>
            </div>
            <div class="news-details-body"></div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // モーダルを閉じるボタンのイベントリスナー
    const closeBtn = modal.querySelector('.news-details-close');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // モーダル外をクリックしても閉じる
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    return modal;
}

// 詳細モーダルを表示する関数
function showDetailsModal(date, title, subtitle, details) {
    const modal = document.querySelector('.news-details-modal') || createDetailsModal();
    
    // 日付をそのまま表示（変換せずに）
    const formattedDate = date;
    
    // モーダルの内容を更新
    modal.querySelector('.news-details-date').textContent = formattedDate;
    modal.querySelector('.news-details-title').textContent = title;
    modal.querySelector('.news-details-subtitle').textContent = subtitle;
    modal.querySelector('.news-details-body').innerHTML = decodeURIComponent(details).replace(/\n/g, '<br>');
    
    // モーダルを表示
    modal.classList.add('active');
}

// ニュースセクションのヘッダーを作成する関数
function createNewsHeader() {
    return `
        <div class="news-header">
            <h2 class="glow-text">News</h2>
            <div class="news-controls">
                <div class="news-sort">
                    <button class="sort-btn sort-date" title="日付でソート">
                        <span>日付</span>
                        <i class="fas fa-sort"></i>
                    </button>
                    <button class="sort-btn sort-title" title="タイトルでソート">
                        <span>タイトル</span>
                        <i class="fas fa-sort"></i>
                    </button>
                </div>
                <button class="refresh-btn" title="更新">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>
        </div>
    `;
}

// ニュースデータを表示する関数
async function displayNews() {
    const newsContainer = document.querySelector('.news-list');
    const loadingElement = document.querySelector('.news-loading');
    const newsSection = document.querySelector('.news-section');
    
    if (!newsContainer || !loadingElement || !newsSection) return;
    
    try {
        // ローディング表示
        loadingElement.style.display = 'block';
        newsContainer.innerHTML = '';
        
        // ニュースデータを取得
        const newsItems = await fetchNewsData();
        
        // データがない場合
        if (newsItems.length === 0) {
            newsContainer.innerHTML = '<div class="no-data-message">ニュースはありません</div>';
            return;
        }
        
        // ニュース項目を表示
        newsContainer.innerHTML = newsItems.map(createNewsItemHTML).join('');
        
        // 詳細ボタンのイベントリスナーを設定
        const detailButtons = newsContainer.querySelectorAll('.news-details-btn');
        detailButtons.forEach(button => {
            button.addEventListener('click', () => {
                const date = button.getAttribute('data-date');
                const title = button.getAttribute('data-title');
                const subtitle = button.getAttribute('data-subtitle');
                const details = button.getAttribute('data-details');
                showDetailsModal(date, title, subtitle, details);
            });
        });
    } catch (error) {
        console.error('ニュースの表示エラー:', error);
        newsContainer.innerHTML = '<div class="error-message">ニュースの読み込みに失敗しました</div>';
    } finally {
        // ローディング非表示
        loadingElement.style.display = 'none';
    }
}

// ニュースセクションを初期化する関数
function initializeNewsSection() {
    const newsSection = document.querySelector('.news-section');
    if (!newsSection) return;
    
    // ニュースヘッダーを追加
    const newsHeader = createNewsHeader();
    newsSection.insertAdjacentHTML('afterbegin', newsHeader);
    
    // ソートボタンのイベントリスナーを設定
    const dateSortBtn = document.querySelector('.sort-date');
    const titleSortBtn = document.querySelector('.sort-title');
    const refreshBtn = document.querySelector('.refresh-btn');
    
    if (dateSortBtn) {
        dateSortBtn.addEventListener('click', () => toggleSort('date'));
    }
    
    if (titleSortBtn) {
        titleSortBtn.addEventListener('click', () => toggleSort('title'));
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.classList.add('rotating');
            displayNews().finally(() => {
                setTimeout(() => {
                    refreshBtn.classList.remove('rotating');
                }, 500);
            });
        });
    }
    
    // ソートアイコンを更新
    updateSortIcons();
}

// ページ読み込み時にニュースを表示
document.addEventListener('DOMContentLoaded', () => {
    initializeNewsSection();
    displayNews();
}); 