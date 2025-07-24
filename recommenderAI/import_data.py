import os
import zipfile
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
import kaggle

def download_and_extract_dataset(dataset_slug, download_path='.'):
    """Downloads and extracts the dataset from Kaggle."""
    print(f"Downloading dataset: {dataset_slug}...")
    kaggle.api.dataset_download_files(dataset_slug, path=download_path, unzip=True)
    print("Dataset downloaded and extracted successfully.")

def get_csv_path(download_path='.'):
    """Finds the path to the first CSV file in the directory."""
    for file in os.listdir(download_path):
        if file.endswith('.csv'):
            return os.path.join(download_path, file)
    raise FileNotFoundError("No CSV file found in the download directory.")

def import_to_mongodb(csv_path, collection):
    """Imports data from a CSV file to a MongoDB collection."""
    print(f"Reading data from {csv_path}...")
    df = pd.read_csv(csv_path)

    # Generate drama_key
    df['drama_key'] = df['Name'].astype(str) + '_' + df['Year'].astype(str)

    # Delete Unnamed: 0
    if 'Unnamed: 0' in df.columns:
        df = df.drop(columns=['Unnamed: 0'])

    # Convert DataFrame to a list of dictionaries (one for each row)
    data = df.to_dict('records')

    print(f"Importing {len(data)} records to MongoDB collection '{collection.name}'...")
    
    # Clear existing data in the collection to avoid duplicates on re-runs
    collection.delete_many({})
    
    # Insert new data
    collection.insert_many(data)
    
    print("Data imported successfully!")

def main():
    """Main function to run the data import process."""
    # --- Configuration ---
    KAGGLE_DATASET_SLUG = 'noorrizki/top-korean-drama-list-1500'
    DB_COLLECTION_NAME = 'dramas'
    
    # Load environment variables from .env file
    load_dotenv()
    mongodb_uri = os.getenv('MONGODB_URI')

    if not mongodb_uri:
        print("Error: MONGODB_URI not found. Make sure it's set in your .env file.")
        return

    try:
        # --- Connect to MongoDB ---
        client = MongoClient(mongodb_uri)
        db = client.get_default_database() # Gets the DB from the connection string
        drama_collection = db[DB_COLLECTION_NAME]
        print(f"Successfully connected to MongoDB. Using database: '{db.name}'")

        # --- Download and Import ---
        download_and_extract_dataset(KAGGLE_DATASET_SLUG)
        csv_file_path = get_csv_path()
        import_to_mongodb(csv_file_path, drama_collection)

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if 'client' in locals() and client:
            client.close()
            print("MongoDB connection closed.")

if __name__ == '__main__':
    main() 