/**
 * Googleスプレッドシートと連携するためのJavaScript
 * 
 * 使用方法:
 * 1. Google Cloud Platformでプロジェクトを作成し、Google Sheets APIを有効化
 * 2. APIキーを取得
 * 3. スプレッドシートを公開設定（「リンクを知っている人が閲覧できる」）
 * 4. スプレッドシートIDを取得（URLから）
 * 5. 以下のコードのAPI_KEYとSPREADSHEET_IDを設定
 */

// Google Sheets APIの設定
const API_KEY = 'AIzaSyCazWIoHruLB0TzdGR-ltnn5TLWoX3cgwI'; // ここにAPIキーを設定
const SPREADSHEET_ID = '13_Pjk2Pw5_-U_y0rXZH0O_4lzeSzgizNeXT8Mvudr7I'; // ここにスプレッドシートIDを設定
const RANGE = 'Sheet1!A2:D100'; // データ範囲（例: 'Sheet1!A2:D100'）

// モックデータを使用するかどうかのフラグ
const USE_MOCK_DATA = false; // trueに設定するとモックデータを使用します

// モックデータ
const MOCK_DATA = [
    ['2024-05-01', 'プロジェクトA', '85', '詳細を見る'],
    ['2024-04-15', 'プロジェクトB', '92', '詳細を見る'],
    ['2024-04-01', 'プロジェクトC', '78', '詳細を見る'],
    ['2024-03-20', 'プロジェクトD', '88', '詳細を見る'],
    ['2024-03-05', 'プロジェクトE', '95', '詳細を見る']
];

/**
 * スプレッドシートIDの確認方法:
 * 1. スプレッドシートを開く
 * 2. URLを確認: https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
 * 3. [SPREADSHEET_ID]の部分がスプレッドシートID
 */

/**
 * スプレッドシートからデータを取得する関数
 * @param {Function} callback - データ取得後のコールバック関数
 */
function fetchSpreadsheetData(callback) {
    // モックデータを使用する場合
    if (USE_MOCK_DATA) {
        console.log('モックデータを使用します');
        setTimeout(function() {
            callback(MOCK_DATA);
        }, 500);
        return;
    }
    
    // APIエンドポイントのURL
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    
    console.log('APIリクエストURL:', url);
    console.log('使用しているスプレッドシートID:', SPREADSHEET_ID);
    console.log('使用しているAPIキー:', API_KEY.substring(0, 5) + '...');
    
    // フェッチリクエスト
    fetch(url)
        .then(response => {
            console.log('APIレスポンスステータス:', response.status);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`スプレッドシートが見つかりません（404）。スプレッドシートIDが正しいか確認してください: ${SPREADSHEET_ID}`);
                } else if (response.status === 400) {
                    throw new Error(`リクエストが不正です（400）。スプレッドシートIDの形式が正しいか確認してください: ${SPREADSHEET_ID}`);
                } else {
                    throw new Error(`ネットワークエラーが発生しました: ${response.status} ${response.statusText}`);
                }
            }
            return response.json();
        })
        .then(data => {
            console.log('APIレスポンスデータ:', data);
            
            // データが存在するか確認
            if (data.values && data.values.length > 0) {
                console.log('取得したデータ行数:', data.values.length);
                callback(data.values);
            } else {
                console.log('データが空です');
                callback([]);
            }
        })
        .catch(error => {
            console.error('データの取得に失敗しました:', error);
            callback(null, error);
        });
}

/**
 * スプレッドシートにデータを追加する関数
 * @param {Array} values - 追加するデータの配列
 * @param {Function} callback - 追加後のコールバック関数
 */
function appendSpreadsheetData(values, callback) {
    // この関数を実装するには、OAuth 2.0認証が必要です
    // 詳細は Google Sheets API のドキュメントを参照してください
    console.log('この機能を実装するには、OAuth 2.0認証が必要です');
    callback(null, new Error('この機能は実装されていません'));
}

/**
 * スプレッドシートのデータを更新する関数
 * @param {Array} values - 更新するデータの配列
 * @param {Function} callback - 更新後のコールバック関数
 */
function updateSpreadsheetData(values, callback) {
    // この関数を実装するには、OAuth 2.0認証が必要です
    // 詳細は Google Sheets API のドキュメントを参照してください
    console.log('この機能を実装するには、OAuth 2.0認証が必要です');
    callback(null, new Error('この機能は実装されていません'));
}

// グローバルスコープに公開
window.googleSheetsAPI = {
    fetchData: fetchSpreadsheetData,
    appendData: appendSpreadsheetData,
    updateData: updateSpreadsheetData
}; 