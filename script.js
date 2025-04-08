document.addEventListener('DOMContentLoaded', () => {
    // ページ遷移アニメーションを適用
    document.body.classList.add('page-transition');
    
    // プロフィールボックスのホバーエフェクト
    const profileBox = document.querySelector('.profile-box');
    if (profileBox) {
        profileBox.addEventListener('mouseover', () => {
            profileBox.style.transform = 'scale(1.02)';
            profileBox.style.transition = 'transform 0.3s ease';
        });
        
        profileBox.addEventListener('mouseout', () => {
            profileBox.style.transform = 'scale(1)';
        });
    }

    // 情報カードのホバーエフェクト
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        card.addEventListener('mouseover', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseout', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // スマホ用メニューの動作
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        // 初期状態で3本線アイコンを設定
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // メニュー項目に遅延を設定
        const menuItems = mobileMenu.querySelectorAll('.mobile-nav li');
        menuItems.forEach((item, index) => {
            item.style.setProperty('--i', index);
        });
        
        // メニューを開く
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // イベントの伝播を停止
            mobileMenu.classList.toggle('active');
            
            // アイコンを切り替え
            if (mobileMenu.classList.contains('active')) {
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // メニュー外をクリックしたら閉じる
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                mobileMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // メニュー内のリンクをクリックしたらメニューを閉じる
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                // ページ遷移アニメーションをリセット
                document.body.classList.remove('page-transition');
                void document.body.offsetWidth; // リフロー
                document.body.classList.add('page-transition');
                
                mobileMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
});
