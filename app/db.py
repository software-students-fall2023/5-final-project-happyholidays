#db stuff here 
from pymongo.mongo_client import MongoClient

client = MongoClient("mongodb://db:27017")
db = client["final-project"]
collection = db["leadingboard"]


def save_to_leading_board(player, time):
    new_record= collection.insert_one({
        'player': player,
        'record': time,
    })
    return new_record
def get_leading_board():
    all_records = collection.find({}, {'_id': 0})
    return all_records
