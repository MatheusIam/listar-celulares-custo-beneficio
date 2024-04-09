from flask import Flask, request, jsonify
import cloudscraper

app = Flask(__name__)

@app.route('/api/pagina', methods=['GET'])
def get_pagina():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL não fornecida'}), 400

    try:
        scraper = cloudscraper.create_scraper()
        response = scraper.get(url)
        response.raise_for_status()  # Verificar erros de status HTTP
        return response.text
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='localhost', port=3001)