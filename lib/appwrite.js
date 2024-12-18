import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
  OauthProvider
} from "react-native-appwrite";

import { PLATFORM, projectId, storageId, databaseId, userCollectionId, videoCollectionId, customDentalPlanCollectionId, aiGeneratedPlanCollectionId } from "@env"
import { SafeAreaProvider } from "react-native-safe-area-context";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: PLATFORM,
  projectId: projectId,
  storageId: storageId,
  databaseId: databaseId,
  userCollectionId: userCollectionId,
  videoCollectionId: videoCollectionId,
  aiGeneratedPlanCollectionId: aiGeneratedPlanCollectionId,
  customDentalPlanCollectionId: customDentalPlanCollectionId
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    const createNewDentalPlan = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.customDentalPlanCollectionId,
      newUser.$id,
      {
        age: 13,
        existingConditions: "",
        recentProcedures: "",
        hygieneFrequency: "",
        toothbrush: "",
        toothpaste: "",
        dietaryHabits: "",
        dentalAppliances_allergies: "",
        creator_dental: newUser.$id
      }
    );

    const createNewAiGenerated = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.aiGeneratedPlanCollectionId,
      newUser.$id,
      {
        ai_generated_plan: "",
        ai_creator: newUser.$id
      }

    )

    // return createNewDentalPlan

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// export async function googleSignIn() {
//   try {
//     const session = createOAuth2Session(OauthProvider.Google,)
//   }
//   catch (error){
//     throw new Error(error)
//   }
// }

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Video Post
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateCustomDentalPlan(form) {

  let

    {

      age,
      existingConditions,
      recentProcedures,
      hygieneFrequency,
      toothbrush,
      toothpaste,
      dietaryHabits,
      dentalAppliances_allergies,
      userId,
      creator_dental,
    } = form

  age = parseInt(age)

  const updateDentalPlan = await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.customDentalPlanCollectionId,
    userId,
    {
      age,
      existingConditions,
      recentProcedures,
      hygieneFrequency,
      toothbrush,
      toothpaste,
      dietaryHabits,
      dentalAppliances_allergies,
      creator_dental
    }
  )

  return updateDentalPlan


}

// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}


export async function getCustomDentalPlan(userId) {

  const fetchDentalPlan = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.customDentalPlanCollectionId,
    userId
  )

  return fetchDentalPlan

}

// Get video posts created by user
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAiGeneratedPlan(user) {

  const getData = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.aiGeneratedPlanCollectionId,
    user.$id
  )

  return getData
}

export async function updateAiGeneratedPlan(user, text) {
  const getData = await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.aiGeneratedPlanCollectionId,
    user.$id, 
    {
      ai_generated_plan: text
    }
  )

  return getData

}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}
