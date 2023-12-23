/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit, faTrash, faSave, faPlus,
} from '@fortawesome/free-solid-svg-icons';
import '../index.css';

function CourseApp() {
  const isClientSide = typeof window !== 'undefined';
  const isLocalStorageAvailable = isClientSide && window.localStorage;

  const storedCourses = isLocalStorageAvailable ? JSON.parse(localStorage.getItem('courses')) || [] : [];
  const [courses, setCourses] = useState(storedCourses);

  const [newCourse, setNewCourse] = useState({
    title: '', description: '', duration: '', materials: [],
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const [newMaterial, setNewMaterial] = useState({ title: '', description: '', embedLink: '' });
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [isEditingMaterial, setIsEditingMaterial] = useState(false);

  useEffect(() => {
    if (isLocalStorageAvailable) {
      localStorage.setItem('courses', JSON.stringify(courses));
    }
  }, [courses, isLocalStorageAvailable]);

  const isValidURL = (url) => {
    const urlPattern = /^(http|https):\/\/[^\s$.?#].[^\s]*$/;
    return urlPattern.test(url);
  };

  const isInputValid = () => newMaterial.title.trim() !== ''
      && newMaterial.description.trim() !== ''
      && isValidURL(newMaterial.embedLink);

  const isCourseInputValid = () => newCourse.title.trim() !== ''
          && newCourse.description.trim() !== ''
          && newCourse.duration.trim() !== '';

  const handleCreateCourse = () => {
    if (isCourseInputValid()) {
      setCourses([...courses, { ...newCourse, id: Date.now() }]);
      setNewCourse({
        title: '', description: '', duration: '', materials: [],
      });
    } else {
      alert('Please fill in all fields for the course.');
    }
  };

  const handleEditCourse = (id) => {
    const courseToEdit = courses.find((course) => course.id === id);
    setEditingCourse(courseToEdit);
    setNewCourse({
      title: courseToEdit.title,
      description: courseToEdit.description,
      duration: courseToEdit.duration,
      materials: courseToEdit.materials,
    });
  };

  const handleUpdateCourse = () => {
    if (isCourseInputValid()) {
      const updatedCourses = courses.map((course) => (course.id === editingCourse.id ? { ...newCourse, id: editingCourse.id } : course));
      setCourses(updatedCourses);
      setEditingCourse(null);
      setNewCourse({
        title: '', description: '', duration: '', materials: [],
      });
    } else {
      alert('Please fill in all fields for the course.');
    }
  };

  const handleDeleteCourse = (id) => {
    const updatedCourses = courses.filter((course) => course.id !== id);
    setCourses(updatedCourses);
  };

  const handleCreateMaterial = () => {
    if (isInputValid()) {
      setNewCourse({
        ...newCourse,
        materials: [...newCourse.materials, { ...newMaterial, id: Date.now() }],
      });
      setNewMaterial({ title: '', description: '', embedLink: '' });
    } else {
      // eslint-disable-next-line no-alert
      alert('Please fill in all fields and provide a valid URL for the embedded link.');
    }
  };

  const handleEditMaterial = (materialId) => {
    const materialToEdit = newCourse.materials.find((material) => material.id === materialId);
    setEditingMaterial(materialToEdit);
    setNewMaterial({
      title: materialToEdit.title,
      description: materialToEdit.description,
      embedLink: materialToEdit.embedLink,
    });
    setIsEditingMaterial(true);
  };

  const handleUpdateMaterial = () => {
    if (isInputValid()) {
      const updatedMaterials = newCourse.materials.map((material) => (material.id === editingMaterial.id ? { ...newMaterial, id: editingMaterial.id } : material));
      setNewCourse({
        ...newCourse,
        materials: updatedMaterials,
      });
      setEditingMaterial(null);
      setNewMaterial({ title: '', description: '', embedLink: '' });
      setIsEditingMaterial(false);
    } else {
      // eslint-disable-next-line no-alert
      alert('Please fill in all fields and provide a valid URL for the embedded link.');
    }
  };

  const handleDeleteMaterial = (materialId) => {
    const updatedMaterials = newCourse.materials.filter((material) => material.id !== materialId);
    setNewCourse({
      ...newCourse,
      materials: updatedMaterials,
    });
  };

  return (
    <div className="min-h-screen bg-blue-900 text-color ">
      <div className="container mx-auto mt-8 p-8 bg-white rounded-lg">
        <h1 className="text-3xl font-semibold mb-8 text-center">Online Course Management</h1>

        {/* Create/Edit Course */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
          <div className="flex flex-wrap items-center space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="text"
              placeholder="Title"
              className="border p-2 flex-grow mb-4 md:mb-0"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className="border p-2 flex-grow mb-4 md:mb-0"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Duration"
              className="border p-2 flex-grow mb-4 md:mb-0"
              value={newCourse.duration}
              onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
            />
            {editingCourse ? (
              <button
                type="button"
                className="bg-blue-500 text-color p-2 ml-2 mb-4 md:mb-0"
                onClick={handleUpdateCourse}
              >
                <FontAwesomeIcon icon={faSave} />
              </button>
            ) : (
              <button
                type="button"
                className="bg-blue-500 text-color p-2 ml-2"
                onClick={handleCreateCourse}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            )}
          </div>
        </div>

        {/* List Courses */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">List of Courses</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-blue-500">
              <thead>
                <tr className="bg-blue-500 text-color">
                  <th className="py-2 px-4 text-left text-white">Title</th>
                  <th className="py-2 px-4 text-left text-white">Description</th>
                  <th className="py-2 px-4 text-left text-white">Duration</th>
                  <th className="py-2 px-4 text-left text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="py-2 px-4">{course.title}</td>
                    <td className="py-2 px-4">{course.description}</td>
                    <td className="py-2 px-4">{course.duration}</td>
                    <td className="py-2 px-4">
                      <button
                        type="button"
                        className="bg-blue-500 text-color p-2 ml-2"
                        onClick={() => handleEditCourse(course.id)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        type="button"
                        className="bg-red-500 text-color p-2 ml-2"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Materials */}
        {editingCourse && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Course Materials</h2>
          <div>
            <h3 className="text-lg font-semibold mb-4">Add New Material</h3>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Title"
                className="border p-2 flex-grow"
                value={newMaterial.title}
                onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                className="border p-2 flex-grow"
                value={newMaterial.description}
                onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Embed Link"
                className="border p-2 flex-grow"
                value={newMaterial.embedLink}
                onChange={(e) => setNewMaterial({ ...newMaterial, embedLink: e.target.value })}
              />
              <button
                type="button"
                className={`bg-${isEditingMaterial ? 'green' : 'blue'}-500 text-color p-2 ml-2`}
                onClick={isEditingMaterial ? handleUpdateMaterial : handleCreateMaterial}
                disabled={!isInputValid()}
              >
                <FontAwesomeIcon icon={isEditingMaterial ? faSave : faPlus} />
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-4">List of Materials</h3>
            <ul>
              {newCourse.materials.map((material) => (
                <li key={material.id} className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>{material.title}</strong>
                      {' '}
                      -
                      {' '}
                      {material.description}
                      {' '}
                      (
                      <a href={material.embedLink} target="_blank" rel="noopener noreferrer">
                        {material.embedLink}
                      </a>
                      )
                    </div>
                    <div>
                      <button
                        type="button"
                        className="ml-2 bg-blue-500 text-color p-2"
                        onClick={() => handleEditMaterial(material.id)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        type="button"
                        className="ml-2 bg-red-500 text-color p-2"
                        onClick={() => handleDeleteMaterial(material.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default CourseApp;
