import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity, Text, ScrollView, Alert } from "react-native";

import { icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { createCustomDentalPlan, getUserPosts, signOut, updateCustomDentalPlan } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { CustomButton, EmptyState, FormField, InfoBox, VideoCard } from "../../components";
import { DentalHistoryFormField } from "../../components";
import { useState } from "react";


const DentalHistory = () => {

  const { setUser, setIsLogged, setNewUser, newUser, user } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    // title: "",
    age: null,
    existingConditions: "",
    recentProcedures: "",
    hygieneFrequency: "",
    toothbrush: "",
    toothpaste: "",
    dietaryHabits: "",
    // dentalAppliances_allergies: "h",
  });



  const submit = async () => {
    try {
      for (const key in form) {
        if (key === 'age') {
          // Check if age field is empty
          if (form[key] === 0 || form[key] === '' || form[key] === undefined || form[key] === null) {
            Alert.alert("Error", "Please enter a valid age");
            return;
          }
        } else if (form[key].trim() === "") {
          Alert.alert("Error", "Please fill in all fields");
          return;
        }
      }

      setSubmitting(true);
      await updateCustomDentalPlan({ ...form, userId: user.$id, creator_dental: user.$id });
      router.replace("/home");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };





  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Dental History</Text>
        {/* 
                title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10" */}

        <DentalHistoryFormField
          title="Age"
          value={form.age}
          placeholder={"How old are you?"}
          handleChangeText={(e) => setForm({ ...form, age: e })}
          otherStyles={"mt-10"}
          isNumericInput={true}
        />

        <DentalHistoryFormField
          title="Do you have any existing dental conditions or concerns?"
          value={form.existingConditions}
          placeholder={"Please describe and type here"}
          handleChangeText={(e) => setForm({ ...form, existingConditions: e })}
          otherStyles={"mt-10"}
        />

        <DentalHistoryFormField
          title="Did you have any recent dental procedures or discomfort?"
          value={form.recentProcedures}
          placeholder={"Please describe and type here"}
          handleChangeText={(e) => setForm({ ...form, recentProcedures: e })}
          otherStyles={"mt-10"}
        />

        <DentalHistoryFormField
          title="How often do you brush, floss, and use mouthwash?"
          value={form.hygieneFrequency}
          placeholder={"Please describe and type here"}
          handleChangeText={(e) => setForm({ ...form, hygieneFrequency: e })}
          otherStyles={"mt-10"}
        />

        <DentalHistoryFormField
          title="What type of toothbrush do you use?"
          value={form.toothbrush}
          placeholder={"Please describe and type here"}
          handleChangeText={(e) => setForm({ ...form, toothbrush: e })}
          otherStyles={"mt-10"}
        />

        <DentalHistoryFormField
          title="What type of toothpaste do you use?"
          value={form.toothpaste}
          placeholder={"Please describe and type here"}
          handleChangeText={(e) => setForm({ ...form, toothpaste: e })}
          otherStyles={"mt-10"}
        />

        <DentalHistoryFormField
          title="What dietary habits or health concerning conditions/habits do you have? (ex: sugary, acidic foods, smoking)"
          value={form.dietaryHabits}
          placeholder={"Please describe and type here"}
          handleChangeText={(e) => setForm({ ...form, dietaryHabits: e })}
          otherStyles={"mt-10"}
        />

        {/* <DentalHistoryFormField
                    title="What dental appliances or allergies do you have?"
                    value={"h"}
                    placeholder={"Please describe and type here"}
                    handleChangeText={(e) => setForm({ ...form, dentalAppliances_allergies: e })}
                    otherStyles={"mt-10"}
                /> */}

        < CustomButton
          title="Save"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={isSubmitting}
        />

      </ScrollView>



    </SafeAreaView>
  )

}

export default DentalHistory;