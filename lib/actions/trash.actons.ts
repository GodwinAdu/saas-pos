"use server"

import { Model, models } from "mongoose";
import Trash from "../models/trash.models";
import { connectToDB } from "../mongoose";
import History from "../models/history.models";
import Store from "../models/store.models";
import { currentUser } from "../helpers/current-user";
import { model } from "mongoose";
import { Schema } from "mongoose";
import { connection } from "mongoose";

interface DocumentProps {
  storeId: string;
  collectionName: string;
  documentId: string;
  userId: string;
  trashMessage: string;
  historyMessage: string;
  actionType: string;
}
export async function deleteDocument({ collectionName, documentId, userId, storeId, trashMessage, historyMessage ,actionType}: DocumentProps) {
  try {
    // Connect to the database
    await connectToDB();

    // Dynamically access the model for the specified collection
    const Model = models[collectionName];
    if (!Model) {
      throw new Error(`Collection '${collectionName}' does not exist`);
    };

    const store = await Store.findById(storeId)

    const autoDelete = store?.autoDeleteTrash

    // Find the document by its ID
    const document = await Model.findById(documentId).exec();
    if (!document) {
      throw new Error(`Document with ID '${documentId}' not found in '${collectionName}'`);
    }

    // Move the document to the trash
    const trashEntry = new Trash({
      storeId,
      originalCollection: collectionName,
      document: document.toObject(),
      message: trashMessage,
      deletedBy: userId,
      deletedAt: new Date(),
      autoDelete,
    });
    // Log the delete action in the History collection
    await History.create({
      storeId,
      actionType, // Use a relevant action type
      details: {
        itemId: document._id,
        deletedAt: new Date(),
      },
      message: historyMessage,
      performedBy: userId, // User who performed the action
      entityId: document._id,  // The ID of the deleted unit
      entityType: `${collectionName.toUpperCase()}`,  // The type of the entity
    });

    await trashEntry.save();

    // Remove the document from the original collection
    await Model.findByIdAndDelete(documentId).exec();

    return trashEntry;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export async function fetchAllTrashes() {
  try {
    const user = await currentUser();
    const storeId = user.storeId

    const trashes = await Trash.find({ storeId }).populate('deletedBy', "fullName").exec();

    if (trashes.length === 0) return [];

    return JSON.parse(JSON.stringify(trashes));

  } catch (error) {
    console.error('Error fetching all trash entries:', error);
    throw error;
  }
}

export async function restoreDocument(trashId: string) {
  try {
    const user = await currentUser();
    const userId = user._id
    const storeId = user.storeId
    // Connect to the database
    await connectToDB();

    // Find the trash entry by its ID
    const trashEntry = await Trash.findById(trashId).exec();
    if (!trashEntry) {
      throw new Error('Trash entry not found');
    }

    const { originalCollection, document } = trashEntry;

    console.log(originalCollection, "collectionName");
    console.log(document, "collection document");

    // Dynamically access or create the model for the original collection
    let Model = models[originalCollection];

    console.log(Model, "collection model ");
    if (!Model) {
      console.warn(`Model '${originalCollection}' not found. Creating dynamic model.`);
      Model = model(originalCollection, new Schema({}, { strict: false }));
    }

    // Restore the document
    await Model.create(document);

    // Remove the trash entry after successful restoration
    await Trash.findByIdAndDelete(trashId).exec();
    await History.create({
      storeId,
      actionType: `${originalCollection.toUpperCase()}_RESTORED`, // Use a relevant action type
      details: {
        itemId: document._id,
        deletedAt: new Date(),
      },
      message: `${originalCollection.toUpperCase()} was restored from trash `,
      performedBy: userId, // User who performed the action
      entityId: document._id,  // The ID of the deleted unit
      entityType: `${originalCollection.toUpperCase()}`,  // The type of the entity
    });

    return JSON.parse(JSON.stringify(document));
  } catch (error) {
    console.error('Error restoring document:', error);
    throw error;
  }
}


export async function deleteTrash(id: string){
  try {
    // Connect to the database
    await connectToDB();

    // Attempt to find and delete the document
    const result = await Trash.findByIdAndDelete(id).exec();

    if (!result) {
      throw new Error('Trash entry not found');
    }

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error('Error deleting trash entry:', error);
    throw error;
  }
}