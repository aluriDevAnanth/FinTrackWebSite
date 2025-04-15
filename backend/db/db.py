import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

host, user, password, database = (
    os.getenv("HOST"),
    os.getenv("USER"),
    os.getenv("PASSWORD"),
    os.getenv("DATABASE"),
)


def create_connection():
    try:
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database,
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None
