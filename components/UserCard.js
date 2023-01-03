import React from "react";
import { Card } from "primereact/card";
import { Chip } from "primereact/chip";
import Router from "next/router";

const cardStyles = {
  chipStyle: "text-sm text-black bg-grey-500 ml-2 mb-1",
  descriptionLines: "col text-justify mr-2",
};

const UserCard = ({
  name,
  headline,
  firstHighlight,
  secondHighlight,
  thirdHighlight,
  technologies,
  userId,
  parentLink,
}) => {
  return (
    <div>
      <Card
        className="shadow-2 cursor-pointer border-solid border-white hover:border-solid hover:border-purple-500"
        title={name}
        subTitle={headline}
        footer={
          <span>
            {technologies.map((technology, technologyIndex) => {
              return (
                <Chip
                  key={technologyIndex}
                  className={cardStyles.chipStyle}
                  label={technology}
                />
              );
            })}
          </span>
        }
        onClick={() => {
          Router.push(`${parentLink}/${userId}`);
        }}
      >
        <div className="grid">
          <div className="col-fixed w-1">
            <i className="pi pi-star-fill text-purple-600"></i>
          </div>
          <div className={cardStyles.descriptionLines}>
            <span>{firstHighlight}</span>
          </div>
        </div>
        <div className="grid">
          <div className="col-fixed w-1">
            <i className="pi pi-star-fill text-purple-600"></i>
          </div>
          <div className={cardStyles.descriptionLines}>
            <span>{secondHighlight}</span>
          </div>
        </div>
        <div className="grid">
          <div className="col-fixed w-1">
            <i className="pi pi-star-fill text-purple-600"></i>
          </div>
          <div className={cardStyles.descriptionLines}>
            <span>{thirdHighlight}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserCard;
