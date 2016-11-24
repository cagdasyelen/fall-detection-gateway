#!/usr/bin/python

import csv
import math
import os

Dir = "Train"
output_file = "output.csv"

class sensors:
    acc_x = 0
    acc_y = 1
    acc_z = 2
    gyro_x = 3
    gyro_y = 4
    gyro_z = 5

def speed_of_change(features, acc_x, acc_y, acc_z):
    change = min(acc_x) - max(acc_x)
    min_x, i_min_x = min((val, idx) for (idx, val) in enumerate(acc_x))
    min_y, i_min_y = min((val, idx) for (idx, val) in enumerate(acc_y))
    min_z, i_min_z = min((val, idx) for (idx, val) in enumerate(acc_z))
    max_x, i_max_x = max((val, idx) for (idx, val) in enumerate(acc_x))
    max_y, i_max_y = max((val, idx) for (idx, val) in enumerate(acc_y))
    max_z, i_max_z = max((val, idx) for (idx, val) in enumerate(acc_z))
    change_in_x = math.tan((max_x-min_x)/(i_max_x-i_min_x))
    change_in_y = math.tan((max_y-min_y)/(i_max_y-i_min_y))
    change_in_z = math.tan((max_z-min_z)/(i_max_z-i_min_z))
    features.append(change_in_x)
    features.append(change_in_y)
    features.append(change_in_z)



def acceleration_vector(features, acc_x, acc_y, acc_z):
    average_acc_x = sum(acc_x)/len(acc_x)
    average_acc_y = sum(acc_y)/len(acc_y)
    average_acc_z = sum(acc_z)/len(acc_z)
    total_sum = math.sqrt(pow(average_acc_x, 2) + pow(average_acc_y, 2) +
                          pow(average_acc_z, 2))

    if not total_sum:
        raise ValueError("The sum of acc vectors are zero. "
                  "Acceleration_vector can't be computed")
        return
    alpha = math.acos(average_acc_x/total_sum)
    beta = math.acos(average_acc_y/total_sum)
    gamma = math.acos(average_acc_z/total_sum)
    features.append(alpha)
    features.append(beta)
    features.append(gamma)


def add_features(acc_x, acc_y, acc_z, gyro_x, gyro_y, gyro_z):
    features = []
    if not len(acc_x) or not len(acc_y) or not len(acc_z)\
            or not len(gyro_x) or not len(gyro_y) or not len(gyro_z):
        raise ValueError("The acc or gyro vector is empty")
        return
    acceleration_vector(features, acc_x, acc_y, acc_z)
    speed_of_change(features, acc_x, acc_y, acc_z)

    return features


def process_samples(stats, samples):
    acc_x = []
    acc_y = []
    acc_z = []
    gyro_x = []
    gyro_y = []
    gyro_z = []
    for sample in samples:
        acc_x.append(sample[sensors.acc_x]);
        acc_y.append(sample[sensors.acc_y]);
        acc_z.append(sample[sensors.acc_z]);
        gyro_x.append(sample[sensors.gyro_x]);
        gyro_y.append(sample[sensors.gyro_y]);
        gyro_z.append(sample[sensors.gyro_z]);

    features = add_features(acc_x, acc_y, acc_z, gyro_x, gyro_y, gyro_z)
    stats.append(features)

def add_label(labels, file_name):
    # find returns 0 if found
    if not file_name.find("Fall"):
        labels.append(1)
        return
    if not file_name.find("Static"):
        labels.append(0)
        return
    labels.append(0)

def get_stats(stats, file_name):
    with open(os.path.join(Dir, file_name), 'rb') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        samples = []
        for sample in reader:
            sample_int = map(int, sample)
            samples.append(sample_int)

        process_samples(stats, samples)


def read_files(files):
    labels = []
    stats = []
    for file_name in files:
        add_label(labels, file_name)
        get_stats(stats, file_name)

    for i,stat in enumerate(stats):
        stat.append(labels[i])

    return stats

def write_csv(stats):
    with open(output_file, 'wb') as csvfile:
        writer = csv.writer(csvfile, delimiter=',')
        for stat in stats:
            writer.writerow(stat)

def main():
    files = []
    try:
        files = os.listdir(Dir)
    except OSError:
        print "Directory not found"
    stats = read_files(files)
    write_csv(stats)

main()
