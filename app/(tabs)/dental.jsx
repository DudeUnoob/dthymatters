import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, Text, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { DentalHistoryFormField, CustomButton, Loader } from "../../components";
import { getCustomDentalPlan, updateCustomDentalPlan } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const DentalHistory = () => {
  const { user } = useGlobalContext();
  const [form, setForm] = useState({
    age: "",
    existingConditions: "",
    recentProcedures: "",
    hygieneFrequency: "",
    toothbrush: "",
    toothpaste: "",
    dietaryHabits: "",
    dentalAppliances_allergies: "",
  });
  const [isLoading, setLoading] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCustomDentalPlan = async () => {
      try {
        const res = await getCustomDentalPlan(user.$id);
        setForm({
          age: res.age || "",
          existingConditions: res.existingConditions || "",
          recentProcedures: res.recentProcedures || "",
          hygieneFrequency: res.hygieneFrequency || "",
          toothbrush: res.toothbrush || "",
          toothpaste: res.toothpaste || "",
          dietaryHabits: res.dietaryHabits || "",
          dentalAppliances_allergies: res.dentalAppliances_allergies || "",
        });

      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to fetch dental plan");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomDentalPlan();
  }, []);

  const submit = async () => {
    try {
      for (const key in form) {
        if (form[key].toString().trim() === "") {
          Alert.alert("Error", "Please fill in all fields");
          return;
        }
      }

      setSubmitting(true);
      await updateCustomDentalPlan({ ...form, userId: user.$id, creator_dental: user.$id });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <ScrollView className="px-4 my-6">
          <Text className="text-2xl text-white font-psemibold">Loading...</Text>
          <Loader isLoading={isLoading}/>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Dental History</Text>
        <DentalHistoryFormField
          title="Age"
          value={form.age.toString()}
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

        <DentalHistoryFormField
                    title="What dental appliances or allergies do you have?"
                    value={form.dentalAppliances_allergies}
                    placeholder={"Please describe and type here"}
                    handleChangeText={(e) => setForm({ ...form, dentalAppliances_allergies: e })}
                    otherStyles={"mt-10"}
                />

        <CustomButton
          title="Save"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={isSubmitting}
        />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DentalHistory;
