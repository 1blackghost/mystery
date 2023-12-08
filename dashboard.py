from main import app,session,request,render_template,redirect,url_for,jsonify
from dbms import users,leader,time_help
from image_generator import generator
from packages import name_generator,time

@app.route("/resumeTime",methods=["GET","POST"])
def stopTime():
	if "start" in session:
		if session["start"]==0:
			session["start"]=time.get_current_time()
			return jsonify({"done":1}),200



@app.route("/getL", methods=["GET"])
def get_leaderboard():
    data = leader.get_all_leaders()
    
    modified_data = []
    for i in data:
        modified_tuple = list(i)
        original_time = i[4]
        
        # Check if the time format is beyond a certain threshold
        if is_time_format_invalid(original_time):
            modified_tuple[4] = "Time Reg. Failed"
        else:
            modified_tuple[4] = time.convert(original_time)

        modified_data.append(tuple(modified_tuple))
    
    return jsonify(modified_data)

def is_time_format_invalid(time_str):
    # Define your threshold condition here
    # For example, check if the time string length is greater than a certain value
    threshold_length = 2  # Adjust this value based on your needs
    val=str(time.convert(time_str))
    val=val.split("h")[0]
    
    return len(val) > threshold_length



@app.route("/ended")
def end():
	if "level" in session:
		return render_template("end.html",levelV=session["level"])
	return render_template("end.html",levelV="You Havent Played Yet.")


@app.route("/game",methods=['GET','POST'])
def game():
	if request.method == "POST":

		data = request.form
		val = data.get('val')
		vals=[]
		for i in val:
			vals.append(str(i))
		check = []
		print(session["digits"])
		if len(session["digits"])==len(vals):
			for i in session["digits"]:
				if i in vals:
					index_to_replace = vals.index(i)
					vals[index_to_replace] = -1
					check.append(1)


		if len(check) == len(session["digits"]):


			session["level"]=int(session["level"])+1
			start=session["start"]
			end=time.get_current_time()
			duration=time.calculate_duration(start,end)
			read_data=time_help.read_time(email=session["email"])
			read_data.append(duration)
			time_help.update_time(email=session["email"],time_list=read_data)	
			session["start"]=0
			last=leader.get_all_leaders()[-1]
			if int(last[3])<int(session["level"]):
				l_data=leader.get_all_leaders()
				for i in l_data:
					if i[2]==session["email"]:
						l_data.remove(i)
				avg=0.0
				for i in read_data:
					avg=avg+i
					print(i)
				avg=avg/len(read_data)

				l_data.append((0,session["name"],session["email"],session["level"],avg,session["pic"]))
				sorted_data = sorted(l_data, key=lambda x: (x[3], -x[4]), reverse=True)

				for i, item in enumerate(sorted_data):
					item = list(item)
					item[0] = i + 1
					sorted_data[i] = tuple(item)


				leader.reset_leaderboard()
				leader.insert_all_leaderboard(sorted_data)
			users.update_user(session["email"],current_level=int(session["level"]))
			session.pop("filepath")
			level=session["level"]
			filename=name_generator.generate_randomest_string(10)+".png"
			session["filepath"]="/static/"+"1tG0f2kKY9.png"
			session["digits"]=["6"]
			print(session["digits"])
			level = session.get("level", None)
			tries = session.get("tries", None)
			filepath = session.get("filepath", None)

			session_data = {"level": level, "tries": tries, "filepath": filepath}
			return jsonify(session_data),200

		else:
			session["tries"]=int(session["tries"])-1
			users.update_user(session["email"],tries=int(session["tries"]))
			level = session.get("level", None)
			tries = session.get("tries", None)
			filepath = session.get("filepath", None)

			session_data = {"level": level, "tries": tries, "filepath": filepath}
			if int(session["tries"])==0:
				session_data = {"continue":"false","level": level, "tries": tries, "filepath": filepath}
			else:
				session_data = {"continue":"true","level": level, "tries": tries, "filepath": filepath}

			return jsonify(session_data),400

	if "email" in session:
		level=int(session["level"])
		if session["tries"]==0:
			return redirect("/ended")
		if "filepath" not in session:
			if "start" not in session:
				time_help.insert_time(email=session["email"],time_list=[0.0,0.0])
				session["start"]=time.get_current_time()
			filename=name_generator.generate_randomest_string(10)+".png"
			session["filepath"]="/static/"+"1tG0f2kKY9.png"
			session["digits"]=["6"]
			print(session["digits"])
		return render_template("dashboard.html",lvl=session["level"],filename=session["filepath"],tries=session["tries"])
	else:
		return redirect("/")


@app.route("/logout")
def logout():

	if "email" in session:
		if "time" in session:
			start=session["start"]
			session.clear()
			session["time"]=start
		session.clear()




	return redirect("/")