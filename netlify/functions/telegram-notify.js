const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const responses = {
    SI: { emoji: '✅', text: 'SÍ', status: 'Procedimiento completado.' },
    NO: { emoji: '❌', text: 'NO', status: 'Procedimiento finalizado.' },
    NECESITO_MAS_TIEMPO: { emoji: '⏳', text: 'NECESITO MÁS TIEMPO', status: 'Tiempo aprobado. Paciencia al 100%.' }
};

async function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        })
    });
    
    if (!resp.ok) {
        const error = await resp.text();
        throw new Error(`Telegram API error: ${error}`);
    }
    
    return resp.json();
}

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error('Missing Telegram credentials');
        return { statusCode: 500, body: 'Server configuration error' };
    }
    
    try {
        const { respuesta } = JSON.parse(event.body);
        const responseData = responses[respuesta];
        
        if (!responseData) {
            return { statusCode: 400, body: 'Invalid response type' };
        }
        
        const message = `🚨 <b>NUEVA RESPUESTA</b> 🚨\n\n` +
            `Gabri ha seleccionado:\n` +
            `<b>${responseData.emoji} ${responseData.text}</b>\n\n` +
            `Sistema: Web de Gabri\n` +
            `Estado: ${responseData.status}`;
        
        await sendTelegramMessage(message);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Telegram notification error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send notification' })
        };
    }
};