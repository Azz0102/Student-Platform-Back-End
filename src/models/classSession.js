const { Model, DataTypes } = require("sequelize");
// Adjust the path as needed
module.exports = (sequelize) => {
    class ClassSession extends Model {
        static associate(models) {
            ClassSession.belongsToMany(models.User, { through: models.Enrollment });
            // ClassSession.hasMany(models.Enrollment);
            // ClassSession.hasOne(models.Conversation, { foreignKey: "classSessionId", onDelete: 'CASCADE' });

            ClassSession.hasMany(models.Enrollment, { foreignKey: 'classSessionId' });
            ClassSession.belongsTo(models.Subject, { foreignKey: 'subjectId' });
            ClassSession.belongsTo(models.Semester, { foreignKey: 'semesterId' });
            ClassSession.hasMany(models.SessionDetails, { foreignKey: 'classSessionId' });
            ClassSession.hasMany(models.FinalExam, { foreignKey: 'classSessionId' });

            ClassSession.belongsToMany(models.News, {
                through: models.NewsClassSession, // Sử dụng models.NewsClassSession
                foreignKey: 'classSessionId',
                otherKey: 'newsId',
                as: 'News' // Đặt alias cho quan hệ
            });


            ClassSession.hasMany(models.Grade, { foreignKey: 'classSessionId' });
        }
    }

    ClassSession.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            subjectId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "subjects",
                    key: "id",
                },
            },
            semesterId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "semester",
                    key: "id",
                },
            },
            fromDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            numOfSessionAWeek: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "ClassSession",
            tableName: "class_sessions",
            timestamps: true,
        }
    );

    return ClassSession;
};
