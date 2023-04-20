import React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { galleryItems } from "../assets/carsList";

const WorkList = () => {
  // { image, model, owner, startDate, finishDate = null }
  const [data, setData] = useState(null);
  setData(galleryItems);

  //   useEffect(() => {
  //     fetch("./assets/carsList.json")
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setData(data);
  //         console.log(data);
  //       })
  //       .catch((error) => console.error(error));
  //   }, []);
  return (
    <View style={styles.container}>
      {data ? (
        data.map(({ id, carPhoto, carModel, owner, startDate, status }) => (
          <View key={id}>
            <Image source={carPhoto} style={styles.image} />
            <View style={styles.infoContainer}>
              <View style={[styles.circle, { backgroundColor: "green" }]}>
                {status}
              </View>
              <Text>{carModel}</Text>
              <Text>{owner}</Text>
              <Text>{startDate}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  model: {
    fontSize: 18,
    //fontWeight: "bold",
    marginBottom: 4,
  },
  owner: {
    fontSize: 16,
    marginBottom: 2,
  },
});

export default WorkList;
