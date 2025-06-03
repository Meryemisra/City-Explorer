// Supabase bağlantısı
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', async () => {
    // URL'den şehir adını al
    const cityName = window.location.pathname.split('/').pop();
    document.getElementById('cityName').textContent = cityName.charAt(0).toUpperCase() + cityName.slice(1);

    // Kullanıcı oturumunu kontrol et
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        document.getElementById('commentFormContainer').style.display = 'block';
        document.getElementById('loginPrompt').style.display = 'none';
    }

    // Yorumları yükle
    loadComments(cityName);

    // Yorum formu submit olayı
    document.getElementById('commentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const commentText = document.getElementById('commentText').value;
        await addComment(cityName, commentText);
        document.getElementById('commentText').value = '';
    });
});

// Yorumları yükle
async function loadComments(cityName) {
    const { data: comments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('city', cityName)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Yorumlar yüklenirken hata oluştu:', error);
        return;
    }

    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';

    comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsList.appendChild(commentElement);
    });
}

// Yorum elementi oluştur
function createCommentElement(comment) {
    const div = document.createElement('div');
    div.className = 'comment-card';
    div.innerHTML = `
        <div class="comment-header">
            <span class="comment-author">${comment.user_email}</span>
            <span class="comment-date">${new Date(comment.created_at).toLocaleString('tr-TR')}</span>
        </div>
        <div class="comment-content">${comment.content}</div>
        <button class="delete-btn" onclick="deleteComment('${comment.id}')" style="display: none;">Sil</button>
    `;

    // Kullanıcı yorumun sahibiyse silme butonunu göster
    supabase.auth.getUser().then(({ data: { user } }) => {
        if (user && user.email === comment.user_email) {
            div.querySelector('.delete-btn').style.display = 'block';
        }
    });

    return div;
}

// Yorum ekle
async function addComment(cityName, content) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
        .from('comments')
        .insert([
            {
                city: cityName,
                content: content,
                user_email: user.email
            }
        ]);

    if (error) {
        console.error('Yorum eklenirken hata oluştu:', error);
        return;
    }

    // Yorumları yeniden yükle
    loadComments(cityName);
}

// Yorum sil
async function deleteComment(commentId) {
    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

    if (error) {
        console.error('Yorum silinirken hata oluştu:', error);
        return;
    }

    // Yorumları yeniden yükle
    const cityName = window.location.pathname.split('/').pop();
    loadComments(cityName);
} 