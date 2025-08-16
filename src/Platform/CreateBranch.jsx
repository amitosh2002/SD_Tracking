import React, { useState, useEffect } from "react";
import "./styles/createBranch.scss"; // Assuming you have a CSS file for styling
import github from "../assets/platformIcons/TaskPlat/github.svg"
import copy from "../assets/platformIcons/TaskPlat/copyIcon.svg"
import colab from "../assets/platformIcons/TaskPlat/colab.svg"
import hora from "../assets/platformIcons/horaLogo.svg"
import { ButtonV1 } from "../customFiles/customComponent/CustomButtons";

const CreateBranch = () => {
  const [repository, setRepository] = useState('');
  const [baseBranchName, setBaseBranchName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [gitData, setGitData] = useState({
    repository: "Web",
    baseBranchName: "main",
    branchName: "main",
  });

  const handleCreateBranch = () => {
    // Correct way to log the data you're about to set
    const newGitData = {
      repository: repository,
      baseBranchName: baseBranchName,
      branchName: branchName
    };
    
    console.log('Creating branch with this data:', newGitData);
    setGitData(newGitData);
  };

  // Optional: Use useEffect to log state changes
  useEffect(() => {
    console.log('Updated gitData state:', gitData);
  }, [gitData]);

  return (
    <div className="github_container">
      <div className="create-branch-container">
        <div className="icon_container">
          <img src={github} alt="github" />
          <img src={colab} alt="+" className="collab_icon" />
          <img src={hora} alt="hora" />
        </div>
        <p className="Lg_body_bold">Create New Branch</p>

        <select className="select_tag" onChange={e => setRepository(e.target.value)} value={repository}>
          <option value="">Select Repository</option>
          <option value="main">Main</option>
          <option value="develop">Develop</option>
          <option value="feature">Feature</option>
          <option value="bugfix">Bugfix</option>
          <option value="release">Release</option>
        </select>

        <select className="select_tag" onChange={e => setBaseBranchName(e.target.value)} value={baseBranchName}>
          <option value="">Select Base Branch</option>
          <option value="main">Main</option>
          <option value="develop">Develop</option>
          <option value="feature">Feature</option>
          <option value="bugfix">Bugfix</option>
          <option value="release">Release</option>
        </select>

        <input
          type="text"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          placeholder="Enter new branch name"
        />
        <ButtonV1  onClick={handleCreateBranch}
          tailIcon={copy}
          text={"Create Branch"}
        />
        {/* <img src={copy} alt="" /> */}
        
    </div>
    </div>
  );
};

export default CreateBranch;