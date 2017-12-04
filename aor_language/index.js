module.exports = {
    aor: {
        action: {
            delete: '削除',
            show: '見る',
            list: '一覧',
            save: '保存',
            create: '作成',
            edit: '編集',
            cancel: 'キャンセル',
            refresh: '更新',
            add_filter: 'フィルターを追加',
            remove_filter: 'フィルターを削除',
        },
        boolean: {
            true: 'はい',
            false: 'いいえ',
        },
        page: {
            list: '%{name} リスト',
            edit: '%{name} #%{id}',
            show: '%{name} #%{id}',
            create: '%{name} を作成',
            delete: '%{name} #%{id} を削除',
            dashboard: 'ダッシュボード',
        },
        input: {
            image: {
                upload_several: 'アップロードするファイルをドロップ、または選択してください',
                upload_single: 'アップロードするファイルをドロップ、または選択してください',
            },
        },
        message: {
            yes: 'はい',
            no: 'いいえ',
            are_you_sure: '本当によろしいですか?',
            about: '詳細',
        },
        navigation: {
            page_out_of_boundaries: '無効なページ指定です',
            page_out_from_end: '無効なページ指定です',
            page_out_from_begin: '無効なページ指定です',
            page_range_info: '%{total} 件の %{offsetBegin}-%{offsetEnd}',
            next: '次へ',
            prev: '前へ',
            no_results: 'no_results',
        },
        auth: {
            username: 'ユーザー名',
            password: 'パスワード',
            sign_in: 'ログイン',
            sign_in_error: 'ログインに失敗しました',
            logout: 'ログアウト',
        },
        notification: {
            updated: '更新されました',
            created: '作成されました',
            deleted: '削除されました',
            item_doesnt_exist: '存在しないアイテムです',
            http_error: 'サーバーエラー',
        },
        validation: {
            required: '必須',
        },
    },
    customNotification: {
        button: {
            edit: '編集',
            delete: '削除',
            ok : 'OK',
            save: '確認する',
            save_and_public: '保存して、公開します。',
        },
        message: {
            status_has_change: "ステータスが変更されました。",
            has_error: "'エラー：ステータスは変更されていません。'",
            NotFound : "Not Found",
        }

    }
};
