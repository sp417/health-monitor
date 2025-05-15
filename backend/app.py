from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
import MySQLdb.cursors

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# MySQL config
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'youruser'
app.config['MYSQL_PASSWORD'] = 'yourpassword'
app.config['MYSQL_DB'] = 'health_db'

mysql = MySQL(app)

@app.route('/api/health', methods=['POST'])
def add_health():
    data = request.json
    user = data['user']
    heart_rate = data['heart_rate']
    temperature = data['temperature']
    notes = data.get('notes', '')
    cursor = mysql.connection.cursor()
    cursor.execute(
        'INSERT INTO health_data (user, heart_rate, temperature, notes) VALUES (%s, %s, %s, %s)',
        (user, heart_rate, temperature, notes)
    )
    mysql.connection.commit()
    cursor.close()
    return jsonify({'status': 'success'})

@app.route('/api/health', methods=['GET'])
def get_health():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('SELECT * FROM health_data ORDER BY id DESC LIMIT 20')
    data = cursor.fetchall()
    cursor.close()
    return jsonify(data)

@app.route('/api/health/<int:entry_id>', methods=['DELETE'])
def delete_health(entry_id):
    cursor = mysql.connection.cursor()
    cursor.execute('DELETE FROM health_data WHERE id=%s', (entry_id,))
    mysql.connection.commit()
    cursor.close()
    return jsonify({'status': 'deleted'})

if __name__ == '__main__':
    app.run(debug=True)
