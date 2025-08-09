import os
import zipfile
import pandas as pd
from pymongo import MongoClient, UpdateOne
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

def clean_data(df):
    """Cleans the DataFrame while preserving the original schema structure."""
    print("Cleaning data...")

    # Define columns for cleaning
    string_cols = ['Sinopsis', 'Tags', 'Genre', 'Main Cast', 'Network', 'Content Rating', 'Name', 'img url']
    numeric_cols = ['Score', 'Year']
    
    # Fill NaN values for string-based columns
    for col in string_cols:
        if col in df.columns:
            df[col] = df[col].fillna('Unknown')

    # Fill NaN values for numeric columns
    if 'Score' in df.columns:
        df['Score'] = df['Score'].fillna(0.0)
    if 'Year' in df.columns:
        df['Year'] = df['Year'].fillna(1900).astype(int) # Keep year as integer

    # Ensure 'Episode' is a string and fill NaN
    if 'Episode' in df.columns:
        df['Episode'] = df['Episode'].fillna('0 episodes').astype(str)
    
    # Verify that there are no more NaN values
    nan_counts = df.isnull().sum().sum()
    if nan_counts == 0:
        print("Data cleaning complete. All NaN values have been handled.")
    else:
        print(f"Warning: Data cleaning finished, but {nan_counts} NaN values still remain.")
        print(df.isnull().sum())

    return df

def import_to_mongodb(csv_path, collection):
    """Imports data from a CSV file to a MongoDB collection."""
    print(f"Reading data from {csv_path}...")
    df = pd.read_csv(csv_path)

    # Clean the data before processing
    df = clean_data(df)

    # Generate drama_key
    df['drama_key'] = df['Name'].astype(str) + '_' + df['Year'].astype(str)

    # Delete Unnamed: 0 if it exists
    if 'Unnamed: 0' in df.columns:
        df = df.drop(columns=['Unnamed: 0'])

    # Convert DataFrame to a list of dictionaries
    data = df.to_dict('records')

    print(f"Importing {len(data)} records to MongoDB collection '{collection.name}'...")
    
    # Bulk upsert data based on the unique drama_key
    if not data:
        print("No data to import.")
        return
        
    operations = [
        UpdateOne({'drama_key': doc['drama_key']}, {'$set': doc}, upsert=True)
        for doc in data
    ]
    
    if operations:
        result = collection.bulk_write(operations)
        print(f"Bulk upsert completed. Matched: {result.matched_count}, Inserted: {len(result.upserted_ids)}, Modified: {result.modified_count}")
    else:
        print("No operations to perform.")
    print("Data upserted successfully!")

def main():
    """Main function to run the data import process."""
    KAGGLE_DATASET_SLUG = 'noorrizki/top-korean-drama-list-1500'
    DB_COLLECTION_NAME = 'dramas'
    
    load_dotenv()
    mongodb_uri = os.getenv('MONGODB_URI')

    if not mongodb_uri:
        print("Error: MONGODB_URI not found in .env file.")
        return

    client = None
    try:
        client = MongoClient(mongodb_uri)
        db = client.get_default_database()
        drama_collection = db[DB_COLLECTION_NAME]
        print(f"Successfully connected to MongoDB. Using database: '{db.name}'")

        download_and_extract_dataset(KAGGLE_DATASET_SLUG)
        csv_file_path = get_csv_path()
        import_to_mongodb(csv_file_path, drama_collection)

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if client:
            client.close()
            print("MongoDB connection closed.")

if __name__ == '__main__':
    main()
